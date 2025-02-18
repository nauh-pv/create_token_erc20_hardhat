import { expect } from "chai";
import hre from "hardhat";

describe("Floppy", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("Floppy");

    const hardhatToken = await Token.deploy();

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function () {
    const [owner, addr1, addr2] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("Floppy");

    const hardhatToken = await Token.deploy();

    await hardhatToken.transfer(addr1.address, 50);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);

    await hardhatToken.connect(addr1).transfer(addr2.address, 50);
    expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
  });
});
