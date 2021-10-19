# Supply chain & data auditing

This repository containts a basic Ethereum DApp that demonstrates a Supply Chain flow between a Seller and Buyer. 

## Groups

This DApp allows for 4 different groups

- Farmer
- Distributor
- Retailer
- Consumer

Only the owner (smart contract creator) can initially allow external addresses inside the groups.
Once an address is part of a group, it can allow external addresses to join the group on its behalf.

All group specific function are protected against non authorized usage.

## Diagrams

### Activity Diagram 

![Activity](https://github.com/hroussille/BC-SupplyChain/blob/master/images/Activity.png)

### Sequence Diagram

![Sequence](https://github.com/hroussille/BC-SupplyChain/blob/master/images/Sequence.png)

### State Diagram

![State](https://github.com/hroussille/BC-SupplyChain/blob/master/images/State.png)

### UML Diagram

![UML](https://github.com/hroussille/BC-SupplyChain/blob/master/images/UML.png)


## Requirements / versions

- Truffle v5.4.13 (core: 5.4.13)
- Solidity - 0.8.8 (solc-js)
- Node v14.16.0
- Web3.js v1.5.3

To install Truffle and the above requirements please use the following command :

```sh
npm install -g ganache-cli
```

To install any additional modules please use the following command inside the app folder :

```sh
npm install
```

## CDN libraries

The following libraries are fetched through CDN :
- @metamask/detect-provider : proper non version specific provider identification
- truffle-contract : syntaxic sugar over truffle built smart contracts
- axios : clean REST requests
- web3 : interact with the Ethereum blockchain

### Prerequisites

Please make sure you've already installed ganache-cli or ganache-gui, Truffle and enabled MetaMask extension in your browser.
By default the dev configurations connects to ganache-gui.

HD wallet mnemonic : "spirit supply whale amount human item harsh scare congress discover talent hamster"

A helper script is present to start ganache-cli with the aformentioned mnemonic :

```sh
./start_ganache-cli.sh
```

### Build the DApp

Move to the app folder :

```sh
cd app
```

Compile the smart contracts :

```sh
truffle compile
```

Test the smart contracts :

```sh
truffle test
```

Deploy them to your prefered network :

```sh
# For dev environment connecting to ganache-gui
truffle migrate
```

```sh
#For dev environment connecting to ganache-cli
truffle migrate --network developmentCLI
```

```sh
# For dev environment connecting to Rinkeby
truffle migrate --network rinkeby
```

If you intend to deploy on rinkeby, or any network different than the local ganache, please provide your mnemonic in a .secret.txt file placed inside the app folder.

### Start the Server

```sh
npm run dev
```

You should now see the frontent at : http://localhost:3000


### Rinkeby address

This app has been deployed to the Rinkeby test network, see the transaction with [this link](https://rinkeby.etherscan.io/tx/0xf44c7d04e80169be86ffaddb18713f6a2a2b47e2e50d4fc19fc1a251e9ade301)

The smart contract address is : 0xa6D17AB24F857Aa5a51CCf74D2509b27b880af57
