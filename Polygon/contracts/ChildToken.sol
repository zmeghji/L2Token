// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IFxERC20} from "./fxPortal/IFxERC20.sol";


contract ChildToken is IFxERC20, ERC20 {
    address internal _fxManager;
    address internal _connectedToken;

    constructor(address fxManager_, address connectedToken_) ERC20("LayerTwo Token", "LTWO") {
         _fxManager = fxManager_;
        _connectedToken = connectedToken_;
    }

    // fxManager rturns fx manager
    function fxManager() public view override returns (address) {
        return _fxManager;
    }

    // connectedToken returns root token
    function connectedToken() public view override returns (address) {
        return _connectedToken;
    }


    function mint(address user, uint256 amount) public override {
        require(msg.sender == _fxManager, "Invalid sender");
        _mint(user, amount);
    }

    function burn(address user, uint256 amount) public override {
        require(msg.sender == _fxManager, "Invalid sender");
        _burn(user, amount);
    }
}
