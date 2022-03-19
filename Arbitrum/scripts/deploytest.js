// const { providers, Wallet } = require('ethers')
// const { ethers } = require('hardhat')
const hre = require("hardhat");

// const { Bridge, networks } = require('arb-ts')
// require('dotenv').config()

// const walletPrivateKey = process.env.PRIVATE_KEY

// const l1Provider = new providers.JsonRpcProvider(process.env.RINKEBY_URL)
// const l1Wallet = new Wallet(walletPrivateKey, l1Provider)

// const l2Provider = new providers.JsonRpcProvider(process.env.ARBITRUM_TESTNET_URL)
// const l2Wallet = new Wallet(walletPrivateKey, l2Provider)

const main = async () => {

    //Deploy Token on Ethereum (Rinkeby)
    
    let rootToken = await deploy("RootToken", ["0x917dc9a69F65dC3082D518192cd3725E1Fa96cA2", "0x70C143928eCfFaf9F5b406f7f4fC28Dc43d68380"]);

}

// async function deploy(contractName, constructorArgs) {
//     const Contract = await ethers.getContractFactory(contractName);
//     const contract = await Contract.deploy(...constructorArgs);
//     console.log(`Deploying ${contractName} `);
//     await contract.deployed();
//     console.log(`${contractName} deployed to:`, contract.address);
//     return contract;
// }
async function deploy(contractName, constructorArgs){
    const Contract = await hre.ethers.getContractFactory(contractName);
    const contract = await Contract.deploy(...constructorArgs);
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
