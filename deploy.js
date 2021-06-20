require("dotenv").config();
const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider(
  process.env.SECRET_PHRASE,
  "https://rinkeby.infura.io/v3/c65de9dd9e6a4d2cb17c756fb3f6a446"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: `0x${bytecode}`,
    })
    .send({
      from: accounts[0],
      gas: "1000000",
      gasPrice: web3.utils.toWei("2", "gwei"),
    });
  console.log(interface);
  console.log("Contract deployed to ", result.options.address);
};

deploy();
