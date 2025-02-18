const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenModule = buildModule("TokenModule", (m) => {
  const token = m.contract("Floppy");

  console.log("Deploying Floppy token", token.address);
  return { token };
});

module.exports = TokenModule;
