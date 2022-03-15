const hre = require("hardhat");
require("dotenv").config();
const { POSClient, use, setProofApi } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require('@maticnetwork/maticjs-ethers')
const { providers, Wallet } = require("ethers");

async function main() {
  let txWithdrawHash = "0xdebc69705ddfc56527fa954d47ef810908ff415f9b74566ca9b4ce1c1a319c8b";
  let rootTunnelAddress = "0x28a717D0419c4207bac8aCB658Ad6B90124A5044";
  let eventSignature = "0x8c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036";

  use(Web3ClientPlugin)
  setProofApi("https://apis.matic.network/");

  const deployer = (await hre.ethers.getSigners())[0];
  const parentProvider = new providers.JsonRpcProvider(process.env.GOERLI_URL);
  const childProvider = new providers.JsonRpcProvider(process.env.MUMBAI_URL);

  const posClient = new POSClient();
  await posClient.init({
    network: 'testnet',
    version: 'mumbai',
    parent: {
      provider: new Wallet(process.env.PRIVATE_KEY, parentProvider),
      defaultConfig: {
        from: deployer.address
      }
    },
    child: {
      provider: new Wallet(process.env.PRIVATE_KEY, childProvider),
      defaultConfig: {
        from: deployer.address
      }
    }
  });


  const isCheckPointed = await posClient.isCheckPointed(txWithdrawHash);

  if (!isCheckPointed) {
    let error = "Transaction not yet checkpointed on parent chain";
    console.log(error);
    throw error;
  }

  try {
    let proof = await posClient.exitUtil.buildPayloadForExit(
      txWithdrawHash,
      eventSignature,
      true
    )
    console.log(`proof.length: ${proof.length}`);

    console.log("test: " + hre.ethers.utils.isBytes(hre.ethers.utils.toUtf8Bytes(proof)));
    console.log("test: " + hre.ethers.utils.isBytes(proof));
    console.log("test: " + hre.ethers.utils.isHexString(proof));
    const rootTunnel = await hre.ethers.getContractAt("FxERC20RootTunnel", rootTunnelAddress);
    console.log("submitting burn proof on root chain to withdraw tokens")
    await rootTunnel.receiveMessage(hre.ethers.utils.hexlify(proof));
  }
  catch (err) {
    console.log(`err: ${err}`);
    throw err
  }
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
