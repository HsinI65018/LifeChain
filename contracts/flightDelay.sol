pragma solidity ^0.8.17;
import "./receive.sol";

contract FlightDelay is Receive{

    struct Insurance {
        string airline;
        string flight_number;
        string departure_date;
        string delay_status;
        string payment_status;
    }
    
    Insurance[] public insurances;

    address [] public owners;
    
    mapping (address => bool) public isOwner;
    mapping (uint => address) public insuranceToOwner;
    mapping (address => uint) public ownerInsuranceCount;

    function createInsurance(address _owner, string memory _airline, string memory _flight_number, string memory _departure_date) public payable {
        _addUniqueOwner(_owner);
        // create user insurance data
        insurances.push(Insurance(_airline, _flight_number, _departure_date, "-", "Un Paid"));
        uint _id = insurances.length - 1;
        insuranceToOwner[_id] = _owner;
        ownerInsuranceCount[_owner] ++;
    }

    // add unique owner in array
    function _addUniqueOwner(address _owner) internal {
        if(isOwner[_owner] == false) {
            // push the unique item to the array
            owners.push(_owner);
            // don't forget to set the mapping value as well
            isOwner[_owner] = true;
        }
    }

    // get insurance ids by user address
    function getInsuranceIds(address _owner) public view returns (uint[] memory) {
        uint[] memory re = new uint[](ownerInsuranceCount[_owner]);
        uint counter = 0;
        for(uint i = 0; i < insurances.length; i++) {
            if(insuranceToOwner[i] == _owner) {
                re[counter] = i;
                counter ++;
            }
        }
        return re;
    }

    // get insurance data by id
    function getInsurance(uint _id) public view returns(string[] memory) {
        string[] memory re = new string[](5);
        re[0] = insurances[_id].airline;
        re[1] = insurances[_id].flight_number;
        re[2] = insurances[_id].departure_date;
        re[3] = insurances[_id].delay_status;
        re[4] = insurances[_id].payment_status;
        return re;
    }

    // return owner array
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    // update insurance data if the flight is dalay or on time
    function updateInsurance(uint _id, string memory _status, string memory _payment, uint _amount) public {
        address payable _to = payable(insuranceToOwner[_id]);
        _withdrawMoneyTo(_to, _amount);
        insurances[_id].delay_status = _status;
        insurances[_id].payment_status = _payment;
    }

    // transfer ether from contract to account
    function _withdrawMoneyTo(address payable _to, uint _amount) internal {
        // _to.transfer(getBalance());
        (bool sent, bytes memory data) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }
}