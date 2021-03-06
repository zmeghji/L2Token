/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("dotenv").config();

require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

module.exports = {
 solidity: "0.8.10",
 // gasReporter: {
 //   enabled: true,
 //   currency: "USD",
 // },
 networks: {
   goerli: {
     url: process.env.GOERLI_URL || "",
     accounts: [process.env.PRIVATE_KEY] 
   },
   polygon: {
    url: process.env.MUMBAI_URL || "",
    accounts:[process.env.PRIVATE_KEY] 
  }
 }
};