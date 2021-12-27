import { ethers } from "ethers";

declare let window: any;

const getEth = () => {
  const eth = window.ethereum;

  if (!eth) {
    throw new Error("metamask not installed");
  }

  return eth;
};

const hasAccounts = async () => {
  const eth = getEth();
  const accounts = (await eth.request({ method: "eth_accounts" })) as string[];

  return accounts && accounts.length;
};

const requestAccounts = async () => {
  const eth = getEth();
  const accounts = (await eth.request({
    method: "eth_requestAccounts",
  })) as string[];

  return accounts && accounts.length;
};

const run = async () => {
  if (!(await hasAccounts()) && !(await requestAccounts())) {
    throw new Error("Please create an account");
  }

  const counter = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    [
      "function count() public",
      "function getCounter() public view returns (uint256)",
    ],
    new ethers.providers.Web3Provider(getEth()).getSigner()
  );

  const el = document.createElement("div");
  const setCounter = async () => {
    el.innerHTML = await counter.getCounter();
  };

  setCounter();

  const button = document.createElement("button");
  button.innerText = "increment";
  button.onclick = async () => {
    await counter.count();
    setCounter();
  };

  document.body.appendChild(el);
  document.body.appendChild(button);
  // document.body.innerHTML = await counter.hello();
};

run();
