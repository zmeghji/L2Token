// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Create2} from "./lib/Create2.sol";
import {FxBaseRootTunnel} from "./fxPortal/FxBaseRootTunnel.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title FxERC20RootTunnel
 */
contract FxERC20RootTunnel is FxBaseRootTunnel, Create2 {
    using SafeERC20 for IERC20;
    // maybe DEPOSIT can be reduced to bytes4
    bytes32 public constant DEPOSIT = keccak256("DEPOSIT");

    event TokenMappedERC20(address indexed rootToken, address indexed childToken);
    event FxWithdrawERC20(
        address indexed rootToken,
        address indexed childToken,
        address indexed userAddress,
        uint256 amount
    );
    event FxDepositERC20(
        address indexed rootToken,
        address indexed depositor,
        address indexed userAddress,
        uint256 amount
    );

    mapping(address => address) public rootToChildTokens;

    constructor(
        address _checkpointManager,
        address _fxRoot
    ) FxBaseRootTunnel(_checkpointManager, _fxRoot) {
    }


    function mapToken(address rootToken, address childToken) public {
        require(rootToChildTokens[rootToken] == address(0x0), "FxERC20RootTunnel: ALREADY_MAPPED");
        rootToChildTokens[rootToken] = childToken;
        emit TokenMappedERC20(rootToken, childToken);
    }


    function deposit(
        address rootToken,
        address user,
        uint256 amount,
        bytes memory data
    ) public {
        require(rootToChildTokens[rootToken] != address(0x0), "FxERC20RootTunnel: TOKEN NOT MAPPED");

        // transfer from depositor to this contract
        IERC20(rootToken).safeTransferFrom(
            msg.sender, // depositor
            address(this), // manager contract
            amount
        );

        // DEPOSIT, encode(rootToken, depositor, user, amount, extra data)
        bytes memory message = abi.encode(DEPOSIT, abi.encode(rootToken, msg.sender, user, amount, data));
        _sendMessageToChild(message);
        emit FxDepositERC20(rootToken, msg.sender, user, amount);
    }

    // exit processor
    function _processMessageFromChild(bytes memory data) internal override {
        (address rootToken, address childToken, address to, uint256 amount) = abi.decode(
            data,
            (address, address, address, uint256)
        );
        // validate mapping for root to child
        require(rootToChildTokens[rootToken] == childToken, "FxERC20RootTunnel: INVALID_MAPPING_ON_EXIT");

        // transfer from tokens to
        IERC20(rootToken).safeTransfer(to, amount);
        emit FxWithdrawERC20(rootToken, childToken, to, amount);
    }
}
