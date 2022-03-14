const hre = require("hardhat");


async function main(){
    let checkpointManager = "0x2890bA17EfE978480615e330ecB65333b880928e";
    let fxRoot = "0x3d1d3E34f7fB6D26245E6640E1c50710eFFf15bA";

    const deployer = (await hre.ethers.getSigners())[0];
    
    //Deploy Token on Ethereum 
    let rootToken = await deploy("RootToken", []);

    //Deploy Root Tunnel
    let rootTunnel = await deploy("FxERC20RootTunnel", [checkpointManager, fxRoot]);

}

async function deploy(contractName, constructorArgs){
    const Contract = await hre.ethers.getContractFactory(contractName);
    const contract = await Contract.deploy(...constructorArgs);
    await contract.deployed();
    console.log(`${contractName} deployed to:`, contract.address);
    return contract;
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });