const hre = require("hardhat");


async function main(){
    

    // let rootTunnelAddress= process.argv[2];
    // let rootTokenAddress= process.argv[3];

    // if (!rootTunnelAddress || rootTunnelAddress == ""){
    //     throw "Provide root tunnel address as first parameter please"
    // }

    // if (!rootTokenAddress || rootTokenAddress == ""){
    //     throw "Provide root token address as first parameter please"
    // }

    let rootTunnelAddress = "0x28a717D0419c4207bac8aCB658Ad6B90124A5044";
    let rootTokenAddress = "0x5A9C69ce46F770AAD768604Ac382873133C094c3";
    let fxChild = "0xCf73231F28B7331BBe3124B907840A94851f9f11";

    const deployer = (await hre.ethers.getSigners())[0];
    
    //Deploy child tunnel
    let childTunnel = await deploy("FxERC20ChildTunnel", [fxChild]);

    //Set Root tunnel address on child tunnel contract
    console.log ("Setting root tunnel address on child tunnel");
    await childTunnel.setFxRootTunnel(rootTunnelAddress);

    // Deploy child token 
    let childToken = await deploy("ChildToken", [childTunnel.address, rootTokenAddress]);

    //Map token on child tunnel
    console.log ("Map Token on child tunnel");
    await childTunnel.mapToken(rootTokenAddress, childToken.address)
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