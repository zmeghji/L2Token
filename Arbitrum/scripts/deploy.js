const { providers, Wallet } = require('ethers')
const { ethers } = require('hardhat')
const { Bridge, networks } = require('arb-ts')
require('dotenv').config()

const walletPrivateKey = process.env.PRIVATE_KEY

const l1Provider = new providers.JsonRpcProvider(process.env.RINKEBY_URL)
const l1Wallet = new Wallet(walletPrivateKey, l1Provider)

const l2Provider = new providers.JsonRpcProvider(process.env.ARBITRUM_TESTNET_URL)
const l2Wallet = new Wallet(walletPrivateKey, l2Provider)

const main = async () => {

    //Deploy Token on Ethereum (Rinkeby)
    const l1ChainId = await l1Wallet.getChainId()
    const l1Network = networks[l1ChainId]
    const l1Gateway = l1Network.tokenBridge.l1CustomGateway
    const l1Router = l1Network.tokenBridge.l1GatewayRouter
    let rootToken = await deploy("RootToken", l1Wallet, [l1Gateway, l1Router]);


    //Deploy Token on Arbitrum (Testnet)
    const l2ChainId = await l2Wallet.getChainId()
    const l2Network = networks[l2ChainId]
    const l2Gateway = l2Network.tokenBridge.l2CustomGateway
    let childToken = await deploy("ChildToken", l2Wallet, [l2Gateway, rootToken.address]);

    // let rootTokenAddress =rootToken.address;
    // let childTokenAddress = childToken.address;

    //Bytes of calldata required to create retryable ticket
    const customBridgeCalldataSize = 1000
    const routerCalldataSize = 1000

    //Get cost to submit a retryable ticket
    const bridge = await Bridge.init(l1Wallet, l2Wallet)
    const [_submissionPriceWeiForCustomBridge,] =
        await bridge.l2Bridge.getTxnSubmissionPrice(customBridgeCalldataSize)
    console.log(`Cost for retryable ticket submission for custom bridge is ${_submissionPriceWeiForCustomBridge}`)
    const [_submissionPriceWeiForRouter,] =
        await bridge.l2Bridge.getTxnSubmissionPrice(routerCalldataSize)
    console.log(`Cost for retryable ticket submission for router is ${_submissionPriceWeiForRouter}`)

    //Get current L2 gas price
    const gasPriceBid = await bridge.l2Provider.getGasPrice()
    console.log(`L2 gas price: ${gasPriceBid.toString()}`)

    //Get total cost of gas for L2, just using hardcoded max gas for now
    const maxGasCustomBridge = 10000000
    const maxGasRouter = 10000000

    const valueForGateway =
        _submissionPriceWeiForCustomBridge.add(gasPriceBid.mul(maxGasCustomBridge))
    const valueForRouter =
        _submissionPriceWeiForRouter.add(gasPriceBid.mul(maxGasRouter))
    const callValue = valueForGateway.add(valueForRouter)

    console.log(`Total eth call value: ${callValue}`)

    //REgister token to arbitrum
    console.log("Registering token on arbitrum")
    console.log (`childToken.address ${childToken.address}`)
    console.log (`_submissionPriceWeiForCustomBridge ${_submissionPriceWeiForCustomBridge}`)
    console.log (`_submissionPriceWeiForRouter ${_submissionPriceWeiForRouter}`)
    console.log (`maxGasCustomBridge ${maxGasCustomBridge}`)
    console.log (`maxGasRouter ${maxGasRouter}`)
    console.log (`gasPriceBid ${gasPriceBid}`)
    console.log (`valueForGateway ${valueForGateway}`)
    console.log (`valueForRouter ${valueForRouter}`)
    console.log (`l2Wallet.address ${l2Wallet.address}`)
    console.log (`callValue ${callValue}`)

    const registerTokenTx = await rootToken.registerTokenOnL2(
        childToken.address,
        _submissionPriceWeiForCustomBridge,
        _submissionPriceWeiForRouter,
        maxGasCustomBridge,
        maxGasRouter,
        gasPriceBid,
        valueForGateway,
        valueForRouter,
        l2Wallet.address,
        {
            value: callValue
        }
    )

    const registerTokenRec = await registerTokenTx.wait()
    console.log(`Registering token complete on layer 1. Transaction has ${registerTokenRec.transactionHash}`)
    
    //we retrieve sequence numbers of the two l1-l2 messages (gateway and router messages) which are unique identifiers,
    // these can be used to compute the transaction hash
    const inboxSeqNums = await bridge.getInboxSeqNumFromContractTransaction(
        registerTokenRec
      )
    
    const [ customBridgeSeqNum, routerSeqNum ] = inboxSeqNums
    const customBridgeL2Tx = await bridge.calculateL2RetryableTransactionHash(customBridgeSeqNum)
    const routerL2Tx = await bridge.calculateL2RetryableTransactionHash(routerSeqNum)

    //Now just wait for those transactions to complete on L2
    console.log( `waiting for L2 tx , current time: ${new Date().toTimeString()}`)
    const customBridgeL2Rec = await l2Provider.waitForTransaction(customBridgeL2Tx)
    const routerL2Rec = await l2Provider.waitForTransaction(routerL2Tx)

    console.log(`L2 transaction hashes: ${customBridgeL2Rec.transactionHash}, ${routerL2Rec.transactionHash}`)
}

async function deploy(contractName, wallet, constructorArgs) {
    const Contract = await (await ethers.getContractFactory(contractName)).connect(wallet);
    const contract = await Contract.deploy(...constructorArgs);
    console.log(`Deploying ${contractName} `);
    await contract.deployed();
    console.log(`${contractName} deployed to:`, contract.address);
    return contract;
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
