// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IGatewayRouter.sol";
import "./ICustomGateway.sol";
import "./ICustomToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract RootToken is ERC20,ICustomToken {
    address public gateway;
    address public router;
    bool private shouldRegisterGateway;

    constructor(address _gateway, address _router) ERC20("LayerTwo Token", "LTWO") {
        gateway = _gateway;
        router = _router;
        _mint(msg.sender, 1000000 ether );
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override(ERC20, ICustomToken) returns (bool) {
        return ERC20.transferFrom(sender, recipient, amount);
    }

    function balanceOf(address account)
        public view override(ERC20, ICustomToken) returns (uint256)
    {
        return ERC20.balanceOf(account);
    }

    /// @dev we only set shouldRegisterGateway to true when in `registerTokenOnL2`
    function isArbitrumEnabled() external view override returns (uint8) {
        require(shouldRegisterGateway, "NOT_EXPECTED_CALL");
        // return uint8(0xa4b1);
        return uint8(177);
    }

    function registerTokenOnL2(
        address l2CustomTokenAddress,
        uint256 maxSubmissionCostForCustomBridge,
        uint256 maxSubmissionCostForRouter,
        uint256 maxGasForCustomBridge,
        uint256 maxGasForRouter,
        uint256 gasPriceBid,
        uint256 valueForGateway,
        uint256 valueForRouter,
        address creditBackAddress
    ) public payable override {
        // we temporarily set `shouldRegisterGateway` to true for the callback in registerTokenToL2 to succeed
        bool prev = shouldRegisterGateway;
        shouldRegisterGateway = true;

        ICustomGateway(gateway).registerTokenToL2{value: valueForGateway}(
            l2CustomTokenAddress,
            maxGasForCustomBridge,
            gasPriceBid,
            maxSubmissionCostForCustomBridge,
            creditBackAddress
        );

        IGatewayRouter(router).setGateway{value: valueForRouter}(
            gateway,
            maxGasForRouter,
            gasPriceBid,
            maxSubmissionCostForRouter,
            creditBackAddress
        );

        shouldRegisterGateway = prev;
    }

    function getChainId() public view returns (uint256 chainId) {
        assembly {
            chainId := chainid()
        }
    }
}
