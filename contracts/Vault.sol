// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";

contract Vault is Ownable, AccessControlEnumerable{
    using SafeERC20 for IERC20;

    IERC20 private token;
    uint256 public maxWithdrawalAmount;
    bool public withdrawEnable;
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");

    function setWithdrawEnable(bool _withdrawEnable) public onlyOwner {
        withdrawEnable = _withdrawEnable;
    }

    function setMaxWithdrawAmount(uint256 _maxAmount) public onlyOwner{
        maxWithdrawalAmount = _maxAmount;
    }

    function setToken(address _token) public onlyOwner {
        token = IERC20(_token);
    }

    constructor() Ownable(_msgSender()){
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function withdraw(
        uint256 _amount,
        address _to
    ) external onlyWithdrawer{
        require(withdrawEnable, "Withdraw is disabled");
        require(_amount <= maxWithdrawalAmount, "Amount exceeds max withdrawal amount");
        token.transfer(_to, _amount);
    }

    function deposit(
        uint256 _amount
    ) external {
        require(
            token.balanceOf(msg.sender) >= _amount,
            "Insufficient account balance"
        );
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), _amount);
    }

    modifier onlyWithdrawer(){  
        require(owner() == _msgSender()||hasRole(WITHDRAWER_ROLE, _msgSender()), "Caller is not a withdrawer");
        _;
    }
}