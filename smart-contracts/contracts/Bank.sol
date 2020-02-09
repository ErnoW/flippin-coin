pragma solidity 0.5.12;
import "./Ownable.sol";

contract Bank is Ownable {
    uint256 public balance;

    event contractWithdrawal(uint256 balance);
    event contractDeposit(uint256 balance);

    constructor() public payable {
        balance = msg.value;
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

        // TODO: Assert

    }

    function withdrawAll() public onlyOwner returns (uint256) {
        withdraw(balance);
    }

    function deposit() public payable onlyOwner returns (uint256) {
        emit contractDeposit(balance);
        balance += msg.value;
        return balance;
    }

    function withdraw(uint256 amount)
        public
        payable
        onlyOwner
        returns (uint256)
    {
        emit contractWithdrawal(balance);
        payout(amount, msg.sender);
        return balance;
    }
}
