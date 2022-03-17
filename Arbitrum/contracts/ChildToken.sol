// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IArbToken.sol";

contract ChildToken is ERC20, IArbToken {
    address public l2Gateway;
    address public l1Address;

    constructor(address _l2Gateway, address _l1TokenAddress) ERC20("LayerTwo Token", "LTWO"){
        l2Gateway = _l2Gateway;
        l1Address = _l1TokenAddress;
    }

    /**
     * @notice should increase token supply by amount, and should (probably) only be callable by the L1 bridge.
     */
    function bridgeMint(address account, uint256 amount) external bridgeOnly(){
        _mint(account, amount);
    }

    /**
     * @notice should decrease token supply by amount, and should (probably) only be callable by the L1 bridge.
     */
    function bridgeBurn(address account, uint256 amount) external bridgeOnly(){
        _burn(account, amount);
    }

    function getChainId() public view returns (uint256 chainId) {
        assembly {
            chainId := chainid()
        }
    }
    
    modifier bridgeOnly(){
        require(msg.sender == l2Gateway, "ChildToken: Method only callable by layer 1 bridge");
        _;
    }

}