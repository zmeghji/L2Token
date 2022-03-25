const { BigNumber, providers, Wallet } = require('ethers')
const { ethers } = require('hardhat')
const { expect } = require ('chai')
const { L2TransactionReceipt, getL2Network } = require("@arbitrum/sdk")
require('dotenv').config()

let txnHash = "0x9e9031e606d4d999c4dfd02fd4ef68e1789cd4ac8dbd41955787122b7bdf5c77";
//0xf989f381b40d99014384a5f8a4f08cf324b6969a3e0ad4d2bfa2b8857897aca0
const walletPrivateKey = process.env.PRIVATE_KEY

const l1Provider = new providers.JsonRpcProvider(process.env.RINKEBY_URL)
const l1Wallet = new Wallet(walletPrivateKey, l1Provider)

const l2Provider = new providers.JsonRpcProvider(process.env.ARBITRUM_TESTNET_URL)
const l2Wallet = new Wallet(walletPrivateKey, l2Provider)

const main = async () => {

    const l2Network = await getL2Network(l2Provider)
    //get transaction reciept from hash
    const receipt = await l2Provider.getTransactionReceipt(txnHash)
    const l2Receipt = new L2TransactionReceipt(receipt)

    //get l2-to-l1 message 
    const messages = await l2Receipt.getL2ToL1Messages(l1Wallet, l2Network)
    const l2ToL1Msg = messages[0]

    //wait for the block to be confirmed on L1 (can take a week for this to happen)
    const timeToWaitMs = 5000 * 60 //check every 5 minutes
    logWithTime("Waiting for the outbox entry to be created. ")
    await l2ToL1Msg.waitUntilOutboxEntryCreated(timeToWaitMs)
    logWithTime("Confirmed that outbox entry exists")

    //get proof required to complete withdrawal
    logWithTime("getting required proof for withdrawal")
    const proofInfo = await l2ToL1Msg.tryGetProof(l2Provider)

    if(await l2ToL1Msg.hasExecuted()) {
        logWithTime("withdrawal already completed")
    }
    else{
        logWithTime("executing withdrawal")
        const res = await l2ToL1Msg.execute(proofInfo)
        const rec = await res.wait()
        logWithTime(`withdrawal complete: ${rec.transactionHash}`)
    }


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
