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
    const tokenWithdrawAmount = hre.ethers.utils.parseEther('1000.0')

    const l2Network = await getL2Network(l2Provider)
    const erc20Bridge = new Erc20Bridger(l2Network)

    logWithTime("Initiating withdrawal from L2")
    const withdrawTx = await erc20Bridge.withdraw({
        amount:tokenWithdrawAmount,
        erc20l1Address: rootTokenAddress,
        l2Signer: l2Wallet
      })

    logWithTime(`withdrawTx hash:  ${withdrawTx.hash}`)
    //0x9e9031e606d4d999c4dfd02fd4ef68e1789cd4ac8dbd41955787122b7bdf5c77
    const withdrawRec = await withdrawTx.wait()

    logWithTime("Finished initiating withdrawal from L2")
    

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
