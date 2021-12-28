import "@nomiclabs/hardhat-ethers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Hero", () => {
  const createHero = async () => {
    const Hero = await ethers.getContractFactory("Hero");
    const hero = await Hero.deploy();
    await hero.deployed();

    return hero;
  };

  let hero;

  before(async () => {
    hero = await createHero();
  });

  it("should get a zero hero array.", async () => {
    expect(await hero.getHeroes()).to.deep.equal([]);
  });

  it("should fail at creating hero cause of payment", async () => {
    let e;

    try {
      await hero.createHero(0, {
        value: ethers.utils.parseEther("0.04999999"),
      });
    } catch (error) {
      e = error;
    }

    expect(e.message.includes("Please send more money")).to.equal(true);
  });
});
