pragma solidity 0.5.12;
import "./Ownable.sol";
import "./Bank.sol";

contract CoinFlip is Ownable, Bank {
    function randomFlip() private view returns (bool) {
        //solium-disable-next-line
        return now % 2 == 1;
    }

    event coinFlip(address caller, uint256 amount, bool won);

    uint256 public minimumBet = 0.0001 ether;

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

    // The game

    function flipCoin() public payable costs(minimumBet) returns (bool) {
        require(balance >= msg.value, "sorry, not enough money in the bank");

        balance += msg.value;

        bool win = randomFlip();

        if (win) {
            payout(msg.value * 2, msg.sender);
        }

        emit coinFlip(msg.sender, msg.value, win);
        return win;

        // TODO: Assertion

    }

}
