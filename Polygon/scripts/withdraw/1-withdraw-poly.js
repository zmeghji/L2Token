const hre = require("hardhat");


async function main(){
    
    let childTokenAddress = "0xeA3503a712E3af7bb01800B99fC28Cf7721c53e4";
    let childTunnelAddress = "0x5A9C69ce46F770AAD768604Ac382873133C094c3";

    let amount = hre.ethers.utils.parseEther('1000.0');

    const childToken = await hre.ethers.getContractAt("ChildToken", childTokenAddress);

    //approve the childTunnel with the amount of ERC 20 tokens
    console.log("Approve the child tunnel with the amount of ERC20 tokens");
    await childToken.approve(childTunnelAddress, amount);
    await new Promise(resolve => setTimeout(resolve, 20000));


    const childTunnel = await hre.ethers.getContractAt("FxERC20ChildTunnel", childTunnelAddress);

    //deposit tokens to polygon chain
    console.log ("withdraw tokens from polygon from root tunnel")
    let tx = await childTunnel.withdraw(childTokenAddress, amount);
    console.log("transaction: " + tx);
    console.log("transaction hash: " + tx.hash);

    //0x7f4c900cc61e5391fefead925350874f9fe415126761cf1b31bd934e2ed88510
    //0xdebc69705ddfc56527fa954d47ef810908ff415f9b74566ca9b4ce1c1a319c8b
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });