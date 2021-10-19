# Supply chain & data auditing

This repository containts a basic Ethereum DApp that demonstrates a Supply Chain flow between a Seller and Buyer. 

## Groups

This DApp allows for 4 different groups

- Farmer
- Distributor
- Retailer
- Consumer

## Diagrams

### Activity Diagram 

![Activity](images/ftc_product_overview.png)

### Sequence Diagram

![Sequence](images/ftc_farm_details.png)

### State Diagram

![State](images/ftc_product_details.png)

### UML Diagram

![UML](images/ftc_transaction_history.png)


## Requirements

- nodejs
- ganache (gui or cli)

```sh
npm install
```

## CDN libraries

The following libraries are fetched through CDN :
- @metamask/detect-provider
- truffle-contract
- axios
- web3
- 
### Prerequisites

Please make sure you've already installed ganache-cli or ganache-gui, Truffle and enabled MetaMask extension in your browser.
By default the dev configurations connects to ganache-gui.

HD wallet mnemonic : "spirit supply whale amount human item harsh scare congress discover talent hamster"

### Build the DApp

Compile the smart contracts :

```sh
truffle compile
```

Deploy them to your prefered network :

```sh
# For dev environment connecting to ganache-gui
truffle migrate
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