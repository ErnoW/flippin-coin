pragma solidity >=0.5.0 <0.6.0;

import "./Ownable.sol";

contract Bank is Ownable {
    uint256 public balance;

    event ContractWithdrawal(uint256 balance);
    event ContractDeposit(uint256 balance);

    mapping(address => uint256) public balancesToBeCollected;

    constructor() public payable {
        balance = msg.value;
    }

    function myBalanceToBeCollected() external view returns (uint256) {
        uint256 total = balancesToBeCollected[msg.sender];
        return total;
    }

    function payout(uint256 amount, address payable to)
        internal
        returns (uint256)
    {
        require(balance >= amount, "Not enough funds in the bank to payout");

        uint256 toTransfer = amount;
        balance -= amount;
        to.transfer(toTransfer);
        return toTransfer;
    }

    function collectBalance() public {
        uint256 payment = balancesToBeCollected[msg.sender];

        if (payment > 0) {
            payout(payment, msg.sender);
            balancesToBeCollected[msg.sender] = 0;
        }
    }

    function withdrawAll() public onlyOwner {
        withdraw(balance);
    }

    function deposit() public payable onlyOwner returns (uint256) {
        emit ContractDeposit(msg.value);
        balance += msg.value;
        return balance;
    }

    function withdraw(uint256 amount)
        public
        payable
        onlyOwner
        returns (uint256)
    {
        emit ContractWithdrawal(balance);
        payout(amount, msg.sender);
        return balance;
    }

    modifier costs(uint256 cost) {
        require(
            msg.value >= cost,
            "not enough funds transacted, need at least"
        );
        _;
    }

    function close() public onlyOwner {
        selfdestruct(msg.sender);
    }
}
