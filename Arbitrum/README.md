# L2 Token - Arbitrum
This is an example of a custom token which has been deployed to both Ethereum and Arbitrum. Deposits and Withdrawals between the chains can be done via the scripts in the repo.

## Setup 🔧
1. Clone repo if not done already
   ```
   git clone https://github.com/zmeghji/L2Token.git
   ```
2. Cd into Polygon directory
   ```
   cd Arbitrum/
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

1. Run deploy.js This will deploy the token to both the Rinkeby Ethereum testnet and the Arbitrum testnet
    ```
    npx hardhat run .\scripts\deploy.js
    ```
## Deposit 💰
1. Edit deposit.js with the correct root token address, then run it. The script will approve the token gateway to spend your tokens. Then it will deposit the tokens to the Arbitrum testnet.
    ```
    npx hardhat run .\scripts\deposit.js
    ```

## Withdraw 💵
1. Edit 1-withdraw.js with the correct root token address, then run it. Make a note of the outputted transaction hash as this will be required to complete the withdrawal.
    ```
    npx hardhat run .\scripts\withdraw\1-withdraw.js
    ```
2. Wait for about 1 day which is the dispute period for Arbitrum on the testnet. Then edit 2-withdraw.js with the correct transaction hash and run it. This will complete the withdrawal and you should see your tokens on the Rinkeby network again.
    ```
    npx hardhat run .\scripts\withdraw\2-withdraw.js
    ```