require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
const { ALCHEMY_API, PRIVATE_KEY } = process.env

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("keys", "Prints the necessary keys for deployment", async (taskArgs, hre) => {
  console.log(ALCHEMY_API),
  console.log(PRIVATE_KEY)
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: "0.8.10",
  networks : {
    rinkeby : {
      url : ALCHEMY_API,
      accounts: [ PRIVATE_KEY ]
    }
  }
};
