const { providers, Wallet } = require('ethers')
const { ethers } = require('hardhat')
const { Watcher } = require('@eth-optimism/core-utils')
const { predeploys, getContractInterface } = require('@eth-optimism/contracts')
require('dotenv').config()

let rootTokenAddress ="0x1836648191Ca81AB5118d824D432E49ffeb906E8";
let childTokenAddress ="0x02515b1763f45d6573Dc72a9bbf3FE74BA4FB089";

const walletPrivateKey = process.env.PRIVATE_KEY

const l1Provider = new providers.JsonRpcProvider(process.env.KOVAN_URL)
const l1Wallet = new Wallet(walletPrivateKey, l1Provider)

const l2Provider = new providers.JsonRpcProvider(process.env.OPTIMISM_TESTNET_URL)
const l2Wallet = new Wallet(walletPrivateKey, l2Provider)

const l2BridgeAddress = '0x4200000000000000000000000000000000000010';
async function main() {

    let rootToken = await ethers.getContractAt("RootToken", rootTokenAddress ,l1Wallet);
    let childToken = await ethers.getContractAt("ChildToken", childTokenAddress ,l2Wallet);


    //Get the address of the bridge on layer 1
    const l2StandardBridge = getContract(
        `../node_modules/@eth-optimism/contracts/artifacts/contracts/L2/messaging/L2StandardBridge.sol/L2StandardBridge.json`,
        l2BridgeAddress,
        l2Wallet
    )
    const l1StandardBridgeAddress = await l2StandardBridge.l1TokenBridge();
    console.log(`The l1 standard bridge address is ${l1StandardBridgeAddress}`);
    const l1StandardBridge = getContract(
        `../node_modules/@eth-optimism/contracts/artifacts/contracts/L1/messaging/L1StandardBridge.sol/L1StandardBridge.json`,
        l1StandardBridgeAddress,
        l1Wallet
    )

    //Approve tokens to be transferred by bridge
    console.log("Approving tokens for transfer by bridge")
    let amount = hre.ethers.utils.parseEther('1000.0');
    let tx1 = await rootToken.approve(l1StandardBridgeAddress, amount);
    await tx1.wait();

    //Deposit tokens to L2
    console.log("Depositing tokens to l2");
    const tx2 = await l1StandardBridge.depositERC20(
        rootToken.address,
        childToken.address,
        amount,
        2000000, //gas
        '0x')
    await tx2.wait();
    logWithTime(`tx2: ${tx2.hash}`);
    const l2Messenger = getL2Messenger()
    const l1Messenger = await getL1Messenger(l2Messenger);
    const watcher = getWatcher(l1Messenger.address, l2Messenger.address);

    logWithTime('Waiting for deposit to be relayed to L2...');
    const [msgHash1] = await watcher.getMessageHashesFromL1Tx(tx2.hash)
    const receipt = await watcher.getL2TransactionReceipt(msgHash1, true);

    logWithTime(`Balance on L1: ${await rootToken.balanceOf(l1Wallet.address)}`)
    logWithTime(`Balance on L2: ${await childToken.balanceOf(l1Wallet.address)}`)

}

function getContract(artifactPath, address, wallet) {
    const artifact = require(artifactPath)
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode)
    const contract = factory
        .connect(wallet)
        .attach(address)
    return contract;
}
function getL2Messenger() {
    return new ethers.Contract(
        predeploys.L2CrossDomainMessenger,
        getContractInterface('L2CrossDomainMessenger'),
        l2Provider
    )
}

async function getL1Messenger(l2Messenger) {
    return new ethers.Contract(
        await l2Messenger.l1CrossDomainMessenger(),
        getContractInterface('L1CrossDomainMessenger'),
        l1Provider
    )
}

function getWatcher(l1MessengerAddress, l2MessengerAddress) {
    // Tool that watches and waits for messages to be relayed between L1 and L2.
    return new Watcher({
        l1: {
            provider: l1Provider,
            messengerAddress: l1MessengerAddress
        },
        l2: {
            provider: l2Provider,
            messengerAddress: l2MessengerAddress
        }
    })
}

function logWithTime(message) {
    console.log(`${new Date().toTimeString()} - ${message}`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    })