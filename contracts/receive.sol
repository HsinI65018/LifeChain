pragma solidity ^0.8.17;

contract Receive {
    receive() external payable {}
    fallback() external payable {}

    function initBalance() public payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}