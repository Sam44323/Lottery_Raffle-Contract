const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
    })
    .send({
      from: accounts[0],
      gas: "1000000",
    });
});

describe("Lottery", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows one account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.03", "ether"),
    });
    const players = await lottery.methods.getAllPlayers().call({
      from: accounts[0],
    });
    assert.strictEqual(accounts[0], players[0]);
    assert.strictEqual(1, players.length);
  });

  it("allows multiple accounts to enter", async () => {
    for (let i = 0; i < 3; i++) {
      await lottery.methods.enter().send({
        from: accounts[i],
        value: web3.utils.toWei("0.03", "ether"),
      });
    }
    const players = await lottery.methods.getAllPlayers().call({
      from: accounts[0],
    });
    assert.strictEqual(accounts[0], players[0]);
    assert.strictEqual(accounts[1], players[1]);
    assert.strictEqual(accounts[2], players[2]);
    assert.strictEqual(3, players.length);
  });
});
