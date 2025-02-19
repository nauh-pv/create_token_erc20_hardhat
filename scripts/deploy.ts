import { ethers, hardhatArguments } from "hardhat";
import * as Config from "./config";

async function main() {
  await Config.initConfig();
  const network = hardhatArguments.network ? hardhatArguments.network : "dev";
  const [deployer] = await ethers.getSigners();
  console.log("Deploy from address:", deployer.address);

  // Deploy Floppy contract
  const Floppy = await ethers.getContractFactory("Floppy");
  const floppy = await Floppy.deploy();
  await floppy.waitForDeployment();
  console.log("Floppy address:", await floppy.getAddress());
  Config.setConfig(network + ".Floppy", await floppy.getAddress());

  // Deploy Vault contract
  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy();
  console.log("Vault address:", await vault.getAddress());
  Config.setConfig(network + ".Vault", await vault.getAddress());

  await Config.updateConfig();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
