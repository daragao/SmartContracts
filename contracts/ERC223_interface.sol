pragma solidity ^0.4.11;

contract ERC223Interface {
    uint public totalSupply;
    function balanceOf(address who) constant returns (uint);
    function transfer(address to, uint value) public returns (bool);
    function transfer(address to, uint value, bytes data) public returns (bool);
    event Transfer(address indexed from, address indexed to, uint value, bytes data);
}
