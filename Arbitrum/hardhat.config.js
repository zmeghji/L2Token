/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("dotenv").config();

require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

module.exports = {
 solidity: "0.8.10",
 networks: {
   rinkeby: {
     url: process.env.RINKEBY_URL || "",
     accounts: [process.env.PRIVATE_KEY] 
   },
   arbitrumTestnet: {
    url: process.env.ARBITRUM_TESTNET_URL || "",
    accounts:[process.env.PRIVATE_KEY] 
  }
 }
};