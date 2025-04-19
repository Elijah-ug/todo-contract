require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    // localhost: {
    //   url: "http://localhost:8545",
    //   accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"]
    // },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/B_JFACTAjwFukpiw2IhFa2TwHCn9EKAB",
      accounts: ["0fd319e8e6f13b94f89ec7fde9b513a3938e6189615aca979b692499d2ba94ad"]
      // url: process.env.SEPOLIA_URL,
      // accounts: [`0x${process.env.ACCOUNT_PRIVATE_KEY}`]
      // accounts: [`0x${process.env.ACCOUNT_PRIVATE_KEY}`]
      // 0x571326642dFac669A1C041D8b46436Ff8774E483 ******contract address
    }
  }
};
// 0fd319e8e6f13b94f89ec7fde9b513a3938e6189615aca979b692499d2ba94ad
// https://eth-sepolia.g.alchemy.com/v2/B_JFACTAjwFukpiw2IhFa2TwHCn9EKAB
