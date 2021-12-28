import "@nomiclabs/hardhat-ethers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Hero", () => {
  const createHero = async () => {
    const Hero = await ethers.getContractFactory("TestHero");
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

  it("create a hero and get the value of magic using a random number", async () => {
    const hero = await createHero();

    await hero.setRandom(69);
    await hero.createHero(0, {
      value: ethers.utils.parseEther("0.05"),
    });
    const h = (await hero.getHeroes())[0];

    // [ S, H, D, I, M ]
    // [ S, H, D, I ]
    // [ S, I, D ]
    expect(await hero.getMagic(h)).to.equal(16);
    expect(await hero.getHealth(h)).to.equal(2);
  });
});
