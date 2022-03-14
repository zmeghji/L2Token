const hre = require("hardhat");


async function main(){
    let rootTokenAddress = "0x5A9C69ce46F770AAD768604Ac382873133C094c3";
    let rootTunnelAddress = "0x28a717D0419c4207bac8aCB658Ad6B90124A5044";
    let childTokenAddress = "0xeA3503a712E3af7bb01800B99fC28Cf7721c53e4";
    let childTunnelAddress = "0x5A9C69ce46F770AAD768604Ac382873133C094c3";

    const rootTunnel = await hre.ethers.getContractAt("FxERC20RootTunnel", rootTunnelAddress);

    //set child tunnel address on root tunnel 
    console.log ("Set child tunnel address on root tunnel contract");
    await rootTunnel.setFxChildTunnel(childTunnelAddress);

    //map the token on the root tunnel 
    console.log("Map the token on the root tunnel contract")
    await rootTunnel.mapToken(rootTokenAddress, childTokenAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });