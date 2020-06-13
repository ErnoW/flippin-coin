(function($) {
  var APP_ADDRESS = "0x6C67849714eca5086506C19CAC171764D2e79fb7";
  var web3 = new Web3(Web3.givenProvider);
  var contractInstance;
  var userAddress;
  var ownerAddress;

  window.addEventListener("load", async () => {
    try {
      await ethereum.enable().then(init);
      window.ethereum.on("accountsChanged", init);
    } catch (error) {
      console.warn("etherem not enabled", error);
    }
  });

  function init(accounts) {
    var contractAddress = APP_ADDRESS;
    userAddress = accounts[0];
    var config = {
      from: accounts[0],
    };

    contractInstance = new web3.eth.Contract(abi, contractAddress, config);
    console.log(contractInstance);

    $("#flip").click(doFlip);
    $("#deposit").click(doDeposit);
    $("#get-balance").click(updateBalance);

    updateOwner();
    updateBalance();
    updateUser();
  }

  function doFlip() {
    var bet = $("#bet-amount").val() || 0;

    var config = {
      value: web3.utils.toWei(bet.toString(), "ether"),
    };

    contractInstance.methods
      .flipCoin()
      .send(config)
      .on("transactionHash", function(hash) {
        console.log("hash flipCoin", hash);
        $(".coin").addClass("flipped");
        $(".coin").removeClass("landed");
        $(".coin").removeClass("won");
        $(".coin").removeClass("loss");
        $("#outcome").text("");
      })
      .on("confirmation", function(confirmationNr) {
        console.log("confirmation flipCoin", confirmationNr);
      })
      .on("receipt", function(receipt) {
        console.log("receipt flipCoin");
        $(".coin").removeClass("flipped");

        setTimeout(function() {
          $(".coin").addClass("landed");
        }, 1);

        updateBalance();
        const { won, amount } = receipt.events.coinFlip.returnValues;
        const ethAmount = web3.utils.fromWei(amount, "ether");

        if (won) {
          $(".coin").addClass("won");
          setTimeout(function() {
            $("#bet-amount").val(ethAmount * 2);
            $("#bet-title").text("Double or nothin'");
            $("#outcome").text("Congrats, you just won " + ethAmount + "ETH, double or nothin'?");
          }, 1000);
        } else {
          $(".coin").addClass("loss");
          setTimeout(function() {
            $("#bet-title").text("Bet amount");
            $("#outcome").text("Oh no, you lost " + ethAmount + " ETH, try again.");
          }, 1000);
        }
      })
      .on("error", function(error) {
        console.log("error flipCoin", error);
      });
  }

  function doDeposit() {
    var deposit = $("#deposit-amount").val() || 0;

    var config = {
      value: web3.utils.toWei(deposit.toString(), "ether"),
    };

    contractInstance.methods
      .deposit()
      .send(config)
      .on("transactionHash", function(hash) {
        console.log("hash deposit", hash);
      })
      .on("confirmation", function(confirmationNr) {
        console.log("confirmation deposit", confirmationNr);
      })
      .on("receipt", function(receipt) {
        console.log("receipt deposit", receipt);
        updateBalance();
      })
      .on("error", function(error) {
        console.log("error deposit", error);
      });
  }

  function updateBalance() {
    contractInstance.methods
      .balance()
      .call()
      .then(function(balance, arg2) {
        console.log("balance", balance);
        console.log("arg2", arg2);
        $("#data-balance").text(web3.utils.fromWei(balance, "ether") + " ETH");
      });
  }

  function updateOwner() {
    contractInstance.methods
      .owner()
      .call()
      .then(function(owner) {
        ownerAddress = owner;
        $("#data-owner").text(owner);
        updateAdminPanel();
      });
  }

  function updateAdminPanel() {
    console.log("update", ownerAddress, userAddress);
    if (ownerAddress.toLowerCase() === userAddress.toLowerCase()) {
      $(".admin-panel").removeClass("closed");
    } else {
      $(".admin-panel").addClass("closed");
    }
  }

  function updateUser() {
    $("#data-user").text(userAddress);
  }
})(jQuery);
