const { BigNumber, providers, Wallet } = require('ethers')
const { ethers } = require('hardhat')
const { expect } = require ('chai')
const { getL2Network, Erc20Bridger, L1ToL2MessageStatus } = require("@arbitrum/sdk")
require('dotenv').config()


let rootTokenAddress = "0xA163301ED403aBbf637A9119593c07eec212fD0B";
let childTokenAddress = "0x2830b7F3475dD3b80216A66d4eE461E973dCD09A";

const walletPrivateKey = process.env.PRIVATE_KEY

const l1Provider = new providers.JsonRpcProvider(process.env.RINKEBY_URL)
const l1Wallet = new Wallet(walletPrivateKey, l1Provider)

const l2Provider = new providers.JsonRpcProvider(process.env.ARBITRUM_TESTNET_URL)
const l2Wallet = new Wallet(walletPrivateKey, l2Provider)

const main = async () => {
    const tokenDepositAmount = hre.ethers.utils.parseEther('1000.0')

    const l2Network = await getL2Network(l2Provider)
    const erc20Bridge = new Erc20Bridger(l2Network)


    //approve the gateway to transfer tokens
    logWithTime("approving gateway to spend tokens");
    const approveTx = await erc20Bridge.approveToken({
        l1Signer: l1Wallet,
        erc20L1Address: rootTokenAddress
      })
    const approveRec = await approveTx.wait()
    logWithTime("finished approving gateway to spend tokens");

    //Deposit token to L2
    logWithTime("Depositing tokens to L2");
    const depositTx = await erc20Bridge.deposit({
        amount: tokenDepositAmount,
        erc20L1Address: rootTokenAddress,
        l1Signer: l1Wallet,
        l2Provider: l2Provider
      })

    //wait for l1 transaction to complete
    const depositRec = await depositTx.wait()
    logWithTime("L1 deposit transaction done");

    //wait for l2 transaction to complete 
    const l2Result = await depositRec.waitForL2(l2Provider)
    logWithTime("L2 deposit transaction done");
    
    l2Result.complete ? 
        logWithTime(`L2 message successful: status: ${L1ToL2MessageStatus[l2Result.status]}`) : 
        logWithTime(`L2 message failed: status ${L1ToL2MessageStatus[l2Result.status]}`)

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
