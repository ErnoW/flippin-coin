# CoinFlip Smart Contracts

A Decentralized application build for the Ethereum Network.
Part of programming course Ethereum201 on [academy.ivanontech.com](https://academy.ivanontech.com/a/17936/3zF57WQv).

## Prerequirements

- Make sure to have [Truffle](https://www.trufflesuite.com/docs) installed globally via `npm install -g truffle`. It is developped on v5.1.12, so things might break in other versions.
- Run a local blockchain via [Ganache](https://www.trufflesuite.com/docs/ganache/overview), or [Ganache-cli](https://github.com/trufflesuite/ganache-cli)
- Have [MetaMask](https://metamask.io/) installed in the browser

## Development

### Smart contracts

- `git clone`
- `cd smart-contracts`
- `yarn install`
- Deploy to the local blockchain via `truffle deploy`
- Change in `/client/constants.js` the `COINFLIP_ADDRESS` to the deployed contracts address

### Client

- `cd client`
- `yarn install`
- Start local server via `yarn start`

### Local network

[Ganache](https://www.trufflesuite.com/docs/ganache/overview)

### Ropsten test network

https://www.trufflesuite.com/tutorials/using-infura-custom-provider
infura.io signup

- Update truffle-config > infuraKey
- Update truffle-config > ropsten.provider

Get mmnomonic seedphrase add it to `smart-contracts/.secret``

## Migrate / deploy

Migrate to local development blockchain
Run `truffle migrate` to migrate
Run `truffle migrate --reset` to force a new migration

Migrate to ropsten network
Note: make sure to have balance in your account
Run `truffle migrate --network ropsten` to migrate to ropsten

## Tests

Run `truffle console` to open the truffle console, followed by `test`
Run `truffle console --network ropsten` to open the truffle console when deployed to Ropsten

## Debugging

Open console (as described in Tests), then call `let instance = await CoinFlip.deployed()`
get an account via `let accounts = await web3.eth.getAccounts()`
call a fucntion like `instance.flipCoin({from: accounts[0], value: web3.utils.toWei("0.0001", "ether")})`
or `instance.deposit({from: accounts[0], value: web3.utils.toWei("0.01", "ether")})`
