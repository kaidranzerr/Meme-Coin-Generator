//SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

contract ERC20Token {
    string public name;
    string public symbol;
    uint public decimals; 

    // how many tokens will be available
    uint256 public totalSupply;

    // python --> dictionary (key , value) pair
    mapping(address => uint256) public balanceOf;
    // how much money this particular address have

    // who approve which address to spend money\
    // address of the owner and address of the spender
    mapping(address => mapping(address => uint256)) public allowance;

    // transfer and approval
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender , uint256 value);

    // it is a special function that will be deployed only once when you deploy the smart contract
    constructor(string memory _name , string memory _symbol , uint8 _decimals , uint256 _totalSupply){
        // whatever we provide the arguments just put it into variable name
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;

    }

    function transfer(address _to , uint256 _value)  public returns (bool success){
        // confirm that you already have this much money
        require(balanceOf[msg.sender] >= _value , "not enough");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender , _to , _value);
        return true;
        // sender of this transaction --> msg.sender
    }

    function approve(address _spender , uint256 _value) public returns(bool success) {
        // only the owner can allow spender
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender , _spender , _value);
        return true;
    }

    function TransferFrom(address _from , address _to , uint256 _value) public returns(bool success){
            require(balanceOf[_from] >= _value , "not enough");
            require(allowance[_from][msg.sender] >= _value , "not enough");
            balanceOf[_from] -= _value;
            balanceOf[_to] += _value;
            allowance[_from][msg.sender] -= _value;
            emit Transfer(_from, _to, _value);
            return true;
    }
}














// public means that we will be able to read these vars from outside of contracts