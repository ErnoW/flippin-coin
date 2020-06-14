# CoinFlip Smart Contracts

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![](https://img.shields.io/badge/Ivan%20on%20Tech%20Academy-Ethereum%20201-blue)](https://academy.ivanontech.com/a/17936/3zF57WQv)
[![Donate with Ethereum](https://en.cryptobadges.io/badge/micro/0x7a4577D692e37b49987d488eFF2c18186A7f6b2A)](https://en.cryptobadges.io/donate/0x7a4577D692e37b49987d488eFF2c18186A7f6b2A)
[![Netlify Status](https://api.netlify.com/api/v1/badges/76d848df-b740-4850-a007-ad3e8d70e8ef/deploy-status)](https://app.netlify.com/sites/flippincoin/deploys)

A Decentralized application build for the Ethereum Network.
Part of programming course Ethereum201 on [academy.ivanontech.com](https://academy.ivanontech.com/a/17936/3zF57WQv).

Build with Truffle and React

## Prerequirements

- Have `yarn` installed
- Make sure to have [Truffle](https://www.trufflesuite.com/docs) installed globally via `npm install -g truffle`. It is developped on v5.1.12, so things might break in other versions.
- Run a local blockchain via [Ganache](https://www.trufflesuite.com/docs/ganache/overview), or [Ganache-cli](https://github.com/trufflesuite/ganache-cli)
- Have [MetaMask](https://metamask.io/) installed in the browser

## Development

```
git clone
```

### Contracts

```
cd smart-contracts
yarn install
```

Deploy to the local blockchain via `truffle deploy`

### Client

```
cd client
yarn install
```

Start local server via `yarn start`
On each deploy, make sure to:

- change in `/client/constants.js` the `COINFLIP_ADDRESS` to the deployed contracts address
- copy the new abi file to `/abis.js`

### test network

Enable / disable, and update the suitable networks in `truffle-config.js`

Get mmnomonic seedphrase add it to `smart-contracts/.secret``

## Deploy contracts

### Local

Run `truffle migrate` to migrate
Run `truffle migrate --reset` to force a new migration

### Migrate to testnet/(mainnet)

Run `truffle migrate --network <<network>>` to migrate to `<<network>>`

## Deploy frontend

Have `netlify-cli` installed

```
npm install netlify-cli -g
```

To deploy, use:

```
netlify deploy
```

## Tests

Run `truffle console` to open the truffle console, followed by `test`
Run `truffle console --network <<network>>` to open the truffle console when deployed to `<<network>>`
