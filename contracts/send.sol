pragma solidity ^0.8.17;

contract Send {
    function toContract() public payable {}

    function withdrawMoneyTo(address payable _to, uint _amount) public {
        (bool sent, bytes memory data) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }
}