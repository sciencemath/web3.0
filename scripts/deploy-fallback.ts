import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

const deploy = async (name, ...args) => {
  const Fallback = await ethers.getContractFactory(name);
  const fallback = await Fallback.deploy(...args);
  await fallback.deployed();

  console.log(fallback.address);

  return fallback;
};

const printStorage = async (contract, name, count) => {
  for (let i = 0; i < count; ++i) {
    console.log(
      name,
      i,
      await ethers.provider.getStorageAt(contract.address, i)
    );
  }
};

const fallback = async () => {
  const a = await deploy("A");
  const b = await deploy("B", a.address);

  await printStorage(b, "B", 3);
  await b.setB(45);
  console.log("-------");
  await printStorage(b, "B", 3);
};

fallback();
