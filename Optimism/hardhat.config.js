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
   kovan: {
     url: process.env.KOVAN_URL || "",
     accounts: [process.env.PRIVATE_KEY] 
   },
   polygon: {
    url: process.env.OPTIMISM_TESTNET_URL || "",
    accounts:[process.env.PRIVATE_KEY] 
  }
 }
};