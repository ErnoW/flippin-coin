const Bank = artifacts.require("Bank");
const truffleAssert = require("truffle-assertions");

const INITIAL_BALANCE = web3.utils.toWei("1", "ether");
const GAS_PRICE = 20000000000;

contract("People", async function(accounts) {
  let instance;
  const owner = accounts[0];
  const player = accounts[1];

  beforeEach(async function() {
    instance = await Bank.new({ value: INITIAL_BALANCE, from: owner });
  });

  it("should add balance on creation", async function() {
    const balance = await instance.balance();
    const contractBalance = await web3.eth.getBalance(instance.address);

    assert(+balance === +INITIAL_BALANCE, "Initial local balance is wrong");
    assert(+contractBalance === +INITIAL_BALANCE, "Initial contract balance is wrong");
  });

  it("should add deposit funds from the owner", async function() {
    const depositingFunds = web3.utils.toWei("2", "ether");

    await truffleAssert.passes(instance.deposit({ value: depositingFunds, from: owner }));

    const balance = await instance.balance();
    const contractBalance = await web3.eth.getBalance(instance.address);

    assert(+balance === +INITIAL_BALANCE + +depositingFunds, "Local balance is wrong");
    assert(+contractBalance === +INITIAL_BALANCE + +depositingFunds, "Contract balance is wrong");
  });

  it("shouldn't add deposit funds from a non-owner", async function() {
    const depositingFunds = web3.utils.toWei("2", "ether");

    await truffleAssert.fails(instance.deposit({ value: depositingFunds, from: player }));

    const balance = await instance.balance();
    assert(+balance === +INITIAL_BALANCE, "Balance after deposit is not correct");
  });

  it("should withdraw funds from a owner", async function() {
    const withdrawFunds = await web3.utils.toWei("0.5", "ether");
    const beforeOwnerFunds = await web3.eth.getBalance(owner);

    const withdrawTx = await instance.withdraw(withdrawFunds, { from: owner });

    const afterLocalBalance = await instance.balance();
    const afterContractBalance = await web3.eth.getBalance(instance.address);
    const afterOwnerFunds = await web3.eth.getBalance(owner);

    // Calculation with bigNumbers to check the difference between expected input and output
    expectedDifference = web3.utils
      .toBN(afterOwnerFunds)
      .sub(web3.utils.toBN(beforeOwnerFunds))
      .sub(web3.utils.toBN(withdrawFunds))
      .add(web3.utils.toBN(GAS_PRICE * withdrawTx.receipt.gasUsed));

    assert(+afterLocalBalance === +INITIAL_BALANCE - +withdrawFunds, "Balance after withdrawal is wrong");
    assert(+afterContractBalance === +INITIAL_BALANCE - +withdrawFunds, "Balance after withdrawal is wrong");
    assert(expectedDifference.isZero(), "Owner funds after withdrawal is wrong");
  });

  it("shouldn't withdraw funds from a non-owner", async function() {
    const withdrawFunds = await web3.utils.toWei("0.5", "ether");

    await truffleAssert.fails(instance.withdraw(withdrawFunds, { from: player }));

    const balance = await instance.balance();
    assert(+balance === +INITIAL_BALANCE, "Balance after deposit is not correct");
  });

  it("shouldn't withdraw funds when balance is too small", async function() {
    const withdrawFunds = await web3.utils.toWei("3", "ether");

    await truffleAssert.fails(instance.withdraw(withdrawFunds, { from: owner }));

    const balance = await instance.balance();
    assert(+balance === +INITIAL_BALANCE, "Balance after deposit is not correct");
  });

  it("should withdraw all funds from the owner", async function() {
    const beforeOwnerFunds = await web3.eth.getBalance(owner);

    const withdrawTx = await instance.withdrawAll({ from: owner });

    const afterLocalBalance = await instance.balance();
    const afterContractBalance = await web3.eth.getBalance(instance.address);
    const afterOwnerFunds = await web3.eth.getBalance(owner);

    // Calculation with bigNumbers to check the difference between expected input and output
    expectedDifference = web3.utils
      .toBN(afterOwnerFunds)
      .sub(web3.utils.toBN(beforeOwnerFunds))
      .sub(web3.utils.toBN(INITIAL_BALANCE))
      .add(web3.utils.toBN(GAS_PRICE * withdrawTx.receipt.gasUsed));

    assert(+afterLocalBalance === 0, "Balance after withdrawal is wrong");
    assert(+afterContractBalance === 0, "Balance after withdrawal is wrong");
    assert(expectedDifference.isZero(), "Owner funds after withdrawal is wrong");
  });

  it("shouldn't withdraw all funds from a non-owner", async function() {
    const withdrawFunds = await web3.utils.toWei("0.5", "ether");

    await truffleAssert.fails(instance.withdraw(withdrawFunds, { from: player }));

    const balance = await instance.balance();
    assert(+balance === +INITIAL_BALANCE, "Balance after deposit is not correct");
  });
});
