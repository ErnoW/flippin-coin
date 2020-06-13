pragma solidity 0.5.12;

import "./Ownable.sol";
import "./Bank.sol";
import "./provableAPI.sol";

contract CoinFlip is Ownable, Bank, usingProvable {
    struct Bet {
        address sender;
        uint256 bet;
    }

    event CoinFlipResult(address caller, uint256 amount, bool won);
    event LogNewProvableQuery(string message);
    event GeneratedRandomNumber(uint256 number);

    uint256 constant MAX_INT_FROM_BYTE = 256;
    uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;

    uint256 public latestNumber;

    mapping(bytes32 => Bet) private pendingQueries;

    constructor() public {
        generateRandom();
    }

    function flipCoin() public payable costs(minimumBet) {
        require(balance >= msg.value, "sorry, not enough money in the bank");
        balance += msg.value;

        bytes32 queryId = generateRandom();

        pendingQueries[queryId] = Bet(msg.sender, msg.value);
    }

    function __callback(
        bytes32 _queryId,
        string memory _result,
        bytes memory _proof
    ) public {
        require(msg.sender == provable_cbAddress(), "incorrect address");
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(_result))) %
            2;

        latestNumber = randomNumber;
        emit GeneratedRandomNumber(randomNumber);

        Bet storage bet = pendingQueries[_queryId];
        delete pendingQueries[_queryId];
        bool hasWon = randomNumber == 0;

        if (hasWon) {
            balancesToBeCollected[bet.sender] =
                balancesToBeCollected[bet.sender] +
                bet.bet *
                2;
        }

        emit CoinFlipResult(bet.sender, bet.bet, hasWon);
    }

    function generateRandom() public payable returns (bytes32) {
        uint256 QUERY_EXECUTION_DELAY = 0;
        uint256 GAS_FOR_CALLBACK = 200000;

        bytes32 queryId = provable_newRandomDSQuery(
            QUERY_EXECUTION_DELAY,
            NUM_RANDOM_BYTES_REQUESTED,
            GAS_FOR_CALLBACK
        );

        emit LogNewProvableQuery("Provable query was sent");
        return queryId;
    }
}
