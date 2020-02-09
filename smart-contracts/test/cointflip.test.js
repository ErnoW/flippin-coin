const CoinFlip = artifacts.require("CoinFlip");
const truffleAssert = require("truffle-assertions");

const INITIAL_BALANCE = web3.utils.toWei("1", "ether");
const GAS_PRICE = 20000000000;

contract("People", async function(accounts) {
  let instance;
  const owner = accounts[0];
  const player = accounts[1];

  beforeEach(async function() {
    instance = await CoinFlip.new({ value: INITIAL_BALANCE, from: owner });
  });

  it("Still todo", async function() {
    // Note: figure out how to deal with the randomness
  });
});
