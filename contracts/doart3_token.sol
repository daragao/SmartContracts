pragma solidity ^0.4.9;

import './CrowdSale.sol';
import './ERC223_token.sol';

contract Doart3Token is ERC223Token {

  function Doart3Token() public {
    name = 'doart3 token';
    symbol = 'DRT';
    decimals = 8;
    totalSupply = 10000000; // 10M
    balances[msg.sender] = totalSupply;
  }
}


contract Doart3Crowdsale is CappedCrowdsale, RefundableCrowdsale {

  function Doart3Crowdsale(uint256 _startTime, uint256 _endTime, uint256 _rate, uint256 _goal, uint256 _cap, address _wallet, ERC223Token _token) public
    CappedCrowdsale(_cap)
    FinalizableCrowdsale()
    RefundableCrowdsale(_goal)
    Crowdsale(_startTime, _endTime, _rate, _wallet, _token)
  {
    //As goal needs to be met for a successful crowdsale
    //the value needs to less or equal than a cap which is limit for accepted funds
    require(_goal <= _cap);
  }
}
