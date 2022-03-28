const { providers, Wallet } = require('ethers')
const { ethers } = require('hardhat')
require('dotenv').config()

const walletPrivateKey = process.env.PRIVATE_KEY

const l1Provider = new providers.JsonRpcProvider(process.env.KOVAN_URL)
const l1Wallet = new Wallet(walletPrivateKey, l1Provider)

const l2Provider = new providers.JsonRpcProvider(process.env.OPTIMISM_TESTNET_URL)
const l2Wallet = new Wallet(walletPrivateKey, l2Provider)

const l2BridgeAddress = '0x4200000000000000000000000000000000000010';
async function main() {

    // //Deploy Layer 1 Token
    let rootToken = await deploy("RootToken", l1Wallet, []);

    // //Deploy token on layer 2 
    let childToken = await deploy("ChildToken", l2Wallet, [l2BridgeAddress, rootToken.address])

    if (await childToken.l1Token() != rootToken.address) {
        logWithTime(`ERROR: L2 token does not correspond to L1 token: L2_ERC20.l1Token() = ${await L2_ERC20.l1Token()}`)
    }
    else{
        logWithTime("Deployment successful");
    }
}

async function deploy(contractName, wallet, constructorArgs) {
    const Contract = await (await ethers.getContractFactory(contractName)).connect(wallet);
    const contract = await Contract.deploy(...constructorArgs);
    logWithTime(`Deploying ${contractName} `);
    await contract.deployed();
    logWithTime(`${contractName} deployed to: ${contract.address}`);
    return contract;
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