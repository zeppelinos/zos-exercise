pragma solidity ^0.4.24;

contract MyWallet {
  event DepositReceived(address sender, uint256 value);

  address public owner;
  bool public initialized = false;

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  function initWallet(address _owner) public {
    owner = _owner;
  }

  function () payable public {
    emit DepositReceived(msg.sender, msg.value);
  }

  function withdraw(uint256 value) public onlyOwner {
    msg.sender.transfer(value);
  }
}
