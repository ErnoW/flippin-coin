pragma solidity 0.5.12;
import "./Ownable.sol";

contract Bank is Ownable {
    uint256 public balance;

    event contractWithdrawal(uint256 balance);
    event contractDeposit(uint256 balance);

    uint256 public minimumBet = 0.0001 ether;
    mapping(address => uint256) internal balancesToBeCollected;

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

        // TODO: Assert
    }

    function collectBalance() public {
        uint256 payment = balancesToBeCollected[msg.sender];

        if (payment > 0) {
            payout(payment, msg.sender);
            delete balancesToBeCollected[msg.sender];
        }
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

    function setMinimumBet(uint256 newMinumumBet) public onlyOwner {
        minimumBet = newMinumumBet;
    }
}
