import { ethers } from "ethers";
import Counter from "../artifacts/contracts/Counter.sol/Counter.json";

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
    Counter.abi,
    new ethers.providers.Web3Provider(getEth()).getSigner()
  );

  const el = document.createElement("div");
  const setCounter = async (count?) => {
    el.innerHTML = count || (await counter.getCounter());
  };

  setCounter();

  const button = document.createElement("button");
  button.innerText = "increment";
  button.onclick = async () => {
    await counter.count();
  };

  counter.on(counter.filters.CounterInc(), (count) => {
    setCounter(count);
  });

  document.body.appendChild(el);
  document.body.appendChild(button);
  // document.body.innerHTML = await counter.hello();
};

run();
