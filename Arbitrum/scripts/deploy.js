const { providers, Wallet } = require('ethers')
const { ethers } = require('hardhat')
const { expect } = require ('chai')
const { getL2Network, L1ToL2MessageStatus } = require("@arbitrum/sdk")
const { AdminErc20Bridger } = require('@arbitrum/sdk/dist/lib/assetBridger/erc20Bridger')
require('dotenv').config()

const walletPrivateKey = process.env.PRIVATE_KEY

const l1Provider = new providers.JsonRpcProvider(process.env.RINKEBY_URL)
const l1Wallet = new Wallet(walletPrivateKey, l1Provider)

const l2Provider = new providers.JsonRpcProvider(process.env.ARBITRUM_TESTNET_URL)
const l2Wallet = new Wallet(walletPrivateKey, l2Provider)

const main = async () => {

    const l2Network = await getL2Network(l2Provider)
    const adminTokenBridger = new AdminErc20Bridger(l2Network)

    const l1Gateway = l2Network.tokenBridge.l1CustomGateway
    const l1Router = l2Network.tokenBridge.l1GatewayRouter
    const l2Gateway= l2Network.tokenBridge.l2CustomGateway

    //Deploy Token on Ethereum (Rinkeby)
    let rootToken = await deploy("RootToken", l1Wallet, [l1Gateway, l1Router]);


    //Deploy Token on Arbitrum (Testnet)
    let childToken = await deploy("ChildToken", l2Wallet, [l2Gateway, rootToken.address]);

    // let rootTokenAddress =rootToken.address;
    // let childTokenAddress = childToken.address;

    //Register token on arbirtum 
    logWithTime ("Registering Token on Arbitrum")
    const registerTokenTx = await adminTokenBridger.registerCustomToken(
        rootToken.address,
        childToken.address,
        l1Wallet,
        l2Provider
      )

    const registerTokenRec = await registerTokenTx.wait()
    logWithTime(`Registering token complete on layer 1. Transaction has ${registerTokenRec.transactionHash}`)
    
    //we retrieve sequence numbers of the two l1-l2 messages (gateway and router messages) which are unique identifiers,
    // these can be used to compute the transaction hash
    const l1ToL2Msgs = await registerTokenRec.getL1ToL2Messages(l2Provider)
    
    logWithTime("checking number of l1 to l2 messages");
    expect(l1ToL2Msgs.length, 'Should be 2 messages.').to.eq(2)

    logWithTime("Wait for setTokenTx");
    const setTokenTx = await l1ToL2Msgs[0].waitForStatus()
    expect(setTokenTx.status, 'Set token not redeemed.').to.eq(
        L1ToL2MessageStatus.REDEEMED
    )

    logWithTime("Wait for setGatewaysTx");
    const setGateways = await l1ToL2Msgs[1].waitForStatus()
    expect(setGateways.status, 'Set gateways not redeemed.').to.eq(
        L1ToL2MessageStatus.REDEEMED
    )

    logWithTime('token is now registered on the custom gateway ')
}

async function deploy(contractName, wallet, constructorArgs) {
    const Contract = await (await ethers.getContractFactory(contractName)).connect(wallet);
    const contract = await Contract.deploy(...constructorArgs);
    console.log(`Deploying ${contractName} `);
    await contract.deployed();
    console.log(`${contractName} deployed to:`, contract.address);
    return contract;
}

function logWithTime(message){
    console.log(`${new Date().toTimeString()} - ${message}`);
}
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
