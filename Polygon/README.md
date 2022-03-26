# L2 Token - Polygon
This is an implementation of an Ethereum-Polygon bridge for a custom ERC-20 token. It has been built using Polygon's FxPortal.

## Setup 🔧

1. Clone repo if not done already
   ```
   git clone https://github.com/zmeghji/L2Token.git
   ```
2. Cd into Polygon directory
   ```
   cd Polygon/
   ```
3. Run npm install 
    ```
    npm install
    ```
4. Compile Contracts
    ```
    npx hardhat compile
    ```
5. Rename example.env to .env and fill out RPC URLs/Private key

## Deploy ⬆️

1. Run 1-deploy-eth.js. This will deploy the root tunnel and root token contracts to the Ethereum Goerli testnet. Make a note of the root token contract address and root tunnel address outputted in the console.
    ```
    npx hardhat run .\scripts\deploy\1-deploy-eth.js --network goerli
    ```
2. Edit 2-deploy-poly.js with the correct root token address and root tunnel address and run it. This will deploy the child tunnel and child token to the Polygon Mumbai testnet. Make a note of the child token address and child tunnel address.
    ```
    npx hardhat run .\scripts\deploy\2-deploy-poly.js --network polygon
    ```
3. Edit 3-deploy-eth.js with the correct addresses for the root tunnel, root token, child tunnel and child tunnel, and then run it. This will configure the root tunnel to communicate with the child tunnel and update the token mapping.
    ```
    npx hardhat run .\scripts\deploy\3-deploy-eth.js --network goerli
    ```

## Deposit 💰
1. Edit deposit.js with the correct root token address and root tunnel address, then run it. It will approve the root tunnel address to transfer your tokens and then deposit them to polygon. It will take about 15 minutes for the tokens to show up in Polygon.
    ```
    npx hardhat run .\scripts\deposit.js --network goerli
    ```

## Withdraw 💵
1. Edit 1-withdraw-poly.js with the correct child token address and child tunnel address, then run it. Make a note of the outputted transaction hash as this will be required to complete the withdrawal.
    ```
    npx hardhat run .\scripts\withdraw\1-withdraw-poly.js --network polygon
    ```
2. Wait for about 90 minutes for the initial withdraw transaction to get checkpointed on the Goerli network. Then edit 2-withdraw-eth.js with the correct transaction hash and root tunnel address and run it. This will complete the withdrawal and you should see your tokens on the Goerli network again.
    ```
    npx hardhat run .\scripts\withdraw\2-withdraw-eth.js --network goerli
    ```
