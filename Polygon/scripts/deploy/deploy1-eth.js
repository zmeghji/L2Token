const hre = require("hardhat");


async function main(){
    const deployer = (await hre.ethers.getSigners())[0];
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