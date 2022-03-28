const { providers, Wallet } = require('ethers')
const { ethers } = require('hardhat')
require('dotenv').config()

let childTokenAddress ="0x02515b1763f45d6573Dc72a9bbf3FE74BA4FB089";

const walletPrivateKey = process.env.PRIVATE_KEY


const l2Provider = new providers.JsonRpcProvider(process.env.OPTIMISM_TESTNET_URL)
const l2Wallet = new Wallet(walletPrivateKey, l2Provider)

const l2BridgeAddress = '0x4200000000000000000000000000000000000010';
async function main() {
    let amount = hre.ethers.utils.parseEther('1000.0');

    let childToken = await ethers.getContractAt("ChildToken", childTokenAddress ,l2Wallet);

    const l2StandardBridge = getContract(
        `../node_modules/@eth-optimism/contracts/artifacts/contracts/L2/messaging/L2StandardBridge.sol/L2StandardBridge.json`,
        l2BridgeAddress,
        l2Wallet
    )

    // Burn the tokens on L2 and ask the L1 contract to unlock on our behalf.
    logWithTime(`Withdrawing tokens back to L1 ...`)
    const tx = await l2StandardBridge.withdraw(
        childToken.address,
        amount,
        2000000, // gas cost
        '0x'
    );
    await tx.wait()
    
    logWithTime(`Transaction complete: ${tx.hash}. Once the dispute period is over, the tokens should have been withdrawn`)
    //0xc8b0e7caa731e8eb733ae8edc47adc4b7bd497cc5dde2b31abe8f9e3684be024
    

}

function getContract(artifactPath, address, wallet) {
    const artifact = require(artifactPath)
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode)
    const contract = factory
        .connect(wallet)
        .attach(address)
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