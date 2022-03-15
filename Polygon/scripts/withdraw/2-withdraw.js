const hre = require("hardhat");

// let proof = '0xf90abb842a96b5c0808401855a1984622fbfbba0b3a73e69caf2745f756eb9ff5671352ea9e4501b84785bd287866aafe74c6deaa08d4624c61f04384d6dba4b10d2ec28ef55c6f0ab4da7da102a792c891dfba364b903e702f903e3018306e134b90100000000000000000000000000000000000000000000000000000000000000000000000400000002000000000080000000000080000000000000000000000000000000000000000000000000080000008000000000000000000001040000000040000000000200000000000000000008000000000000400000800000100000000000000000000000000020000000000000000000000…0000000000000000000000000000001010a000000000000000000000000018b733ce9661190ffe3728561b9dcc0f60f8c694a0000000000000000000000000be188d6641e8b680743a4815dfa0f6208038960fb8a0000000000000000000000000000000000000000000000000000390e56e1a1b5b000000000000000000000000000000000000000000000000060ad6297298c732000000000000000000000000000000000000000000000a5769c92bd0d65a484c00000000000000000000000000000000000000000000000006074544047eabd7000000000000000000000000000000000000000000000a5769ccbcb6447463a782000301';
let proof = '0xf90bbd842a96b5c0b9010016d5392417648934e901b11ed474cbb895b66ab8b5f417de34f49aeef238c64affd9d3da0f9113d208189c921044b3af2818d2fa2478ec65fc57a07097a284ac80df9bfd682356238ac338b8249f8e2e6b5bea5768a228e2f1c2154a6702bb53b8289f4d76563c680f33a5d2ab120592afa422678346c16fdd17d20af7964f259365af52df5af3173e3f9faa98c8568aad5210570574c1df356db22ab4237b6e3b852af602ae00dbe2e829505ecf05c1d1d328e2bcc6aafc0e54aed00b5435d079e43c6da021e3db68e1b7565105177286765ab470e5a09e69072e59538fa971449924fc995f4476a410775927e5c8d2091135d169c6d01666792a54575f491e8401855a1984622fbfbba0b3a73e69caf2745f756eb9ff5671352ea9e4501b84785bd287866aafe74c6deaa08d4624c61f04384d6dba4b10d2ec28ef55c6f0ab4da7da102a792c891dfba364b903e702f903e3018306e134b9010000000000000000000000000000000000000000000000000000000000000000000000040000000200000000008000000000008000000000000000000000000000000000000000000000000008000000800000000000000000000104000000004000000000020000000000000000000800000000000040000080000010000000000000000000000000002000000000000000000000000080000000000000000000200000000000000000000000000800000000000000000000000000000000004000000002000000000401000000000000000000000000000088100040000020000000000000000000000000000000000000000010000000000000000100100000f902d8f89b94ea3503a712e3af7bb01800b99fc28cf7721c53e4f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa000000000000000000000000018b733ce9661190ffe3728561b9dcc0f60f8c694a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000003635c9adc5dea00000f8f9945a9c69ce46f770aad768604ac382873133c094c3e1a08c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036b8c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000800000000000000000000000005a9c69ce46f770aad768604ac382873133c094c3000000000000000000000000ea3503a712e3af7bb01800b99fc28cf7721c53e400000000000000000000000018b733ce9661190ffe3728561b9dcc0f60f8c69400000000000000000000000000000000000000000000003635c9adc5dea00000f9013d940000000000000000000000000000000000001010f884a04dfe1bbbcf077ddc3e01291eea2d5c70c2b422b415d95645b9adcfd678cb1d63a00000000000000000000000000000000000000000000000000000000000001010a000000000000000000000000018b733ce9661190ffe3728561b9dcc0f60f8c694a0000000000000000000000000be188d6641e8b680743a4815dfa0f6208038960fb8a0000000000000000000000000000000000000000000000000000390e56e1a1b5b000000000000000000000000000000000000000000000000060ad6297298c732000000000000000000000000000000000000000000000a5769c92bd0d65a484c00000000000000000000000000000000000000000000000006074544047eabd7000000000000000000000000000000000000000000000a5769ccbcb6447463a7b90678f90675f891a0ca69189d1c7c398a8cbcedebd8cb7ceb8dc2e5fe04341493912dddf15ae556aca039a0f542a1a07ba0e8bf9d56ba25c5f0bf49cbcfa24e2309be0caa5a46b2fc42a0ddea0a23e7abe4ce7842d9bda6a7f637318341f6e4d6e31c2012132a130857d98080808080a026d47cefef790643e8cbff795db9901a0da06c092687bb44732e90c212f5480f8080808080808080f901f180a08d56d292b8c9ce6eb0a85e3c0bf517fe0ea610f3203700f7a32cc3a315791aaba0eb7c9e81eda0dd132adab1309c95c2061f6ab9b6e0a6cb2523448b4f3ff1f099a085a6413df6ab264f5b8549a51096946a7e7bdd7f6dc6a6007ec46f97e752bce9a0fa97086a8d33c4a86abc37829da3ae73d0bf748916ae1224b9f06b5bb0ded19ba08b5390b17fb3ebbb31cc22696c5c1c2c9e66182905a2e20fea7adbaccd2dd3a4a01f39b3abb1a8194657eacf1a98bd01c37aea7bf677693442e96ceadd355235b6a0e39e9451b15f32723ce4f60e66b2b824f0a8bd832eeb5dd15477cbc473ddde62a0ad2387b4cfe1266c75aeb9b5ae514ce41e53e75eaa35ae2e17f6130782152015a0aa0ae9aef45ef20e2d414348227797a1205975533367a3d228cb204e17eeb5f3a0a8d6d9217c927d1a92cc5f177dd01b30cdf282ea7cc0bc0cdbeb400e8dbedaa9a01398ce449799c6f6026d68d38241d5e3e8e34e96d422ca7716ec7ce700088577a05614ca4fc450b4bb2a92611d41e57161bf317c77131732de3e559c53e05c5dafa00a22ff0e80fda1e93730ec12272ac6be13d947a32183fdf27ad02c1edde6f102a0061690bd49d3bd005fef1087f5219f514dea523a811e6e23bd044f9a8d18834fa094d0c5da9f97ac16eafa9063fbfdd1e53d2f97abdcce0ebcf4ca31b1dd5b7d2f80f903eb20b903e702f903e3018306e134b9010000000000000000000000000000000000000000000000000000000000000000000000040000000200000000008000000000008000000000000000000000000000000000000000000000000008000000800000000000000000000104000000004000000000020000000000000000000800000000000040000080000010000000000000000000000000002000000000000000000000000080000000000000000000200000000000000000000000000800000000000000000000000000000000004000000002000000000401000000000000000000000000000088100040000020000000000000000000000000000000000000000010000000000000000100100000f902d8f89b94ea3503a712e3af7bb01800b99fc28cf7721c53e4f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa000000000000000000000000018b733ce9661190ffe3728561b9dcc0f60f8c694a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000003635c9adc5dea00000f8f9945a9c69ce46f770aad768604ac382873133c094c3e1a08c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036b8c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000800000000000000000000000005a9c69ce46f770aad768604ac382873133c094c3000000000000000000000000ea3503a712e3af7bb01800b99fc28cf7721c53e400000000000000000000000018b733ce9661190ffe3728561b9dcc0f60f8c69400000000000000000000000000000000000000000000003635c9adc5dea00000f9013d940000000000000000000000000000000000001010f884a04dfe1bbbcf077ddc3e01291eea2d5c70c2b422b415d95645b9adcfd678cb1d63a00000000000000000000000000000000000000000000000000000000000001010a000000000000000000000000018b733ce9661190ffe3728561b9dcc0f60f8c694a0000000000000000000000000be188d6641e8b680743a4815dfa0f6208038960fb8a0000000000000000000000000000000000000000000000000000390e56e1a1b5b000000000000000000000000000000000000000000000000060ad6297298c732000000000000000000000000000000000000000000000a5769c92bd0d65a484c00000000000000000000000000000000000000000000000006074544047eabd7000000000000000000000000000000000000000000000a5769ccbcb6447463a782000301';



async function main(){
  let rootTunnelAddress = "0x28a717D0419c4207bac8aCB658Ad6B90124A5044";

  const rootTunnel = await hre.ethers.getContractAt("FxERC20RootTunnel", rootTunnelAddress);


  console.log("test: "+ hre.ethers.utils.isBytes(hre.ethers.utils.toUtf8Bytes(proof)));
  console.log("test: "+ hre.ethers.utils.isBytes(proof));
  console.log("test: "+ hre.ethers.utils.isHexString(proof));
  
  console.log("submitting burn proof on root chain to withdraw tokens")
  await rootTunnel.receiveMessage(
    hre.ethers.utils.toUtf8Bytes(proof));

  //   proof);
    // hre.ethers.utils.toUtf8Bytes(proof));
    // hre.ethers.utils.hexlify(proof));

    // hre.ethers.utils.arrayify(proof))
    //hre.ethers.utils.formatBytes32String(
  
  //expecting 93000
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
