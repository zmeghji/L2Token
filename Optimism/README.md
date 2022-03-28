# L2 Token - Optimism
This is an example of a custom token which has been deployed to both Ethereum and Optimism. Deposits and Withdrawals between the chains can be done via the scripts in the repo.

## Setup 🔧
1. Clone repo if not done already
   ```
   git clone https://github.com/zmeghji/L2Token.git
   ```
2. Cd into Optimism directory
   ```
   cd Optimism/
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

1. Run deploy.js This will deploy the token to both the Kovan Ethereum testnet and the Optimism testnet
    ```
    npx hardhat run .\scripts\deploy.js
    ```
## Deposit 💰
1. Edit deposit.js with the correct root token address, then run it. The script will approve the token gateway to spend your tokens. Then it will deposit the tokens to the Optimism testnet.
    ```
    npx hardhat run .\scripts\deposit.js
    ```
