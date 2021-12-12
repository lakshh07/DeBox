const fs = require("fs");
const hre = require("hardhat");

async function main() {
  const DeCloud = await hre.ethers.getContractFactory("DeCloud");
  const deCloud = await DeCloud.deploy();
  await deCloud.deployed();

  console.log("DeCloud deployed to :", deCloud.address);

  let config = `export const DeCloudAddress = "${deCloud.address}"`;

  let data = JSON.stringify(config);
  fs.writeFileSync("config.js", JSON.parse(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
