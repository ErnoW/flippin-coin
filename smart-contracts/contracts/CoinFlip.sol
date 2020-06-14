pragma solidity >=0.5.0 <0.6.0;

import "./Ownable.sol";
import "./Bank.sol";
import "./provableAPI.sol";

contract CoinFlip is Ownable, Bank, usingProvable {
    struct Bet {
        address sender;
        uint256 bet;
    }

    event CoinFlipResult(
        address caller,
        bytes32 queryId,
        uint256 amount,
        bool won
    );
    event LogNewProvableQuery(address caller, bytes32 queryId);
    event GeneratedRandomNumber(uint256 number);
    event LogError(string error);

    uint256 private constant NUM_RANDOM_BYTES_REQUESTED = 1;
    uint256 private constant QUERY_EXECUTION_DELAY = 0;
    uint256 private constant GAS_FOR_CALLBACK = 200000;
    uint256 public minimumBet = 0.01 ether;

    // Percentage of profit this contract takes
    uint256 public houseTakes = 1;

    mapping(bytes32 => Bet) public pendingQueries;

    constructor() public {
        provable_setProof(proofType_Ledger);
    }

    function setMinimumBet(uint256 newMinumumBet) public onlyOwner {
        minimumBet = newMinumumBet;
    }

    function setHouseTakes(uint256 newHouseTakesPercentage) public onlyOwner {
        houseTakes = newHouseTakesPercentage;
    }

    function flipCoin() public payable costs(minimumBet) returns (bytes32) {
        uint256 provablePrice = provable_getPrice("RANDOM", GAS_FOR_CALLBACK);
        require(
            balance >= msg.value + provablePrice,
            "sorry, not enough money in the bank"
        );

        balance = balance + msg.value - provablePrice;

        bytes32 queryId = provable_newRandomDSQuery(
            QUERY_EXECUTION_DELAY,
            NUM_RANDOM_BYTES_REQUESTED,
            GAS_FOR_CALLBACK
        );
        emit LogNewProvableQuery(msg.sender, queryId);

        pendingQueries[queryId] = Bet(msg.sender, msg.value);
    }

    function __callback(
        bytes32 _queryId,
        string memory _result,
        bytes memory _proof
    ) public {
        require(msg.sender == provable_cbAddress(), "incorrect address");

        if (
            provable_randomDS_proofVerify__returnCode(
                _queryId,
                _result,
                _proof
            ) != 0
        ) {
            emit LogError("invalid proof");
        } else {
            uint256 randomNumber = uint256(
                keccak256(abi.encodePacked(_result))
            ) % 2;

            emit GeneratedRandomNumber(randomNumber);

            bool hasWon = randomNumber == 0;

            if (hasWon) {
                uint256 profit = (pendingQueries[_queryId].bet *
                    (100 - houseTakes)) / 100;
                balancesToBeCollected[pendingQueries[_queryId].sender] =
                    balancesToBeCollected[pendingQueries[_queryId].sender] +
                    pendingQueries[_queryId].bet +
                    profit;

                emit CoinFlipResult(
                    pendingQueries[_queryId].sender,
                    _queryId,
                    profit,
                    hasWon
                );
            } else {
                emit CoinFlipResult(
                    pendingQueries[_queryId].sender,
                    _queryId,
                    pendingQueries[_queryId].bet,
                    hasWon
                );
            }
        }
    }
}
