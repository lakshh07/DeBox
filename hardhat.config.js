require("@nomiclabs/hardhat-waffle");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.10",
  network: {
    ropsten: {
      url: "https://ropsten.infura.io/v3/f0ce148c25664d8c942ccc8e7063669d",
      accounts: [`0x${process.env.ROPSTENKEY}`],
    },
    mumbai: {
      // url: "https://mumbai.infura.io/v3/f0ce148c25664d8c942ccc8e7063669d",
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [`0x${process.env.MUMBAIKEY}`]
    },
  },
};
