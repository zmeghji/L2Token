const hre = require("hardhat");


async function main(){
    let rootTokenAddress = "0x5A9C69ce46F770AAD768604Ac382873133C094c3";
    let rootTunnelAddress = "0x28a717D0419c4207bac8aCB658Ad6B90124A5044";

    let amount = hre.ethers.utils.parseEther('1000.0');

    const rootToken = await hre.ethers.getContractAt("RootToken", rootTokenAddress);

    //approve the rootTunnel with the amount of ERC 20 tokens
    console.log("Approve the root tunnel with the amount of ERC20 tokens");
    await rootToken.approve(rootTunnelAddress, amount);
    await new Promise(resolve => setTimeout(resolve, 20000));


    const deployer = (await hre.ethers.getSigners())[0];
    const rootTunnel = await hre.ethers.getContractAt("FxERC20RootTunnel", rootTunnelAddress);

    //deposit tokens to polygon chain
    console.log ("deposit tokens to polygon from root tunnel")
    await rootTunnel.deposit(rootTokenAddress, 
      deployer.address, amount, hre.ethers.utils.formatBytes32String(""));

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });