pragma solidity 0.5.12;

contract Ownable {
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "only access for the owner");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }
}
