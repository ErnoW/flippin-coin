# CoinFlip

A Decentralized application build for the Ethereum Network.
Part of programming course Ethereum201 on [academy.ivanontech.com](https://academy.ivanontech.com/a/17936/3zF57WQv).

## Prerequirements

- Make sure to have [Truffle](https://www.trufflesuite.com/docs) installed globally via `npm install -g truffle`. It is developped on v5.1.12, so things might break in other versions.
- Run a local blockchain via [Ganache](https://www.trufflesuite.com/docs/ganache/overview).
- Have [MetaMask](https://metamask.io/) installed in the browser

## Development

- `git clone`
- `cd smart-blockchain`
- `yarn install` or `npm install`
- Deploy to the local blockchain via `truffle deploy`
- Change in `/client/js/main.js` the `APP_ADDRESS` to the deployed contracts address

Serve the client locally via any way, for example:

- python 2: `python -m SimpleHTTPServer`
- python 3: `python -m http.server`
- using VSCode editors 'live server' plugin

## Deploy

Run `truffle deploy`

## Migrate

Run `truffle migrate` to migrate
Run `truffle migrate --reset` to force a new migration

## Tests

Run `truffle console` to open the truffle console, followed by `test`
