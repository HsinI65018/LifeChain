pragma solidity ^0.8.17;

contract FlightDelay {

    struct Insurance {
        string airline;
        string flight_number;
        string departure_date;
        bool delay_status;
        string payment_status;
    }
    
    Insurance[] public insurances;

    string [] public airlines;
    address [] public owners;
    
    mapping (string => bool) public isAirline;
    mapping (address => bool) public isOwner;
    mapping (uint => address) public insuranceToOwner;
    mapping (address => uint) public ownerInsuranceCount;

    function createInsurance(address _owner, string memory _airline, string memory _flight_number, string memory _departure_date) public {
        _addUniqueAirline(_airline);
        _addUniqueOwner(_owner);

        // create user insurance data
        insurances.push(Insurance(_airline, _flight_number, _departure_date, false, "un_paid"));
        uint _id = insurances.length - 1;
        insuranceToOwner[_id] = _owner;
        ownerInsuranceCount[_owner] ++;
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
        (insurances[_id].delay_status == false) ? re[3] = "F" : re[3] = "T";
        re[4] = insurances[_id].payment_status;
        return re;
    }


    // add unique airline in array
    function _addUniqueAirline(string memory _airline) internal {
        if (isAirline[_airline] == false) {
            // push the unique item to the array
            airlines.push(_airline);
            // don't forget to set the mapping value as well
            isAirline[_airline] = true;
        }
    }
    function _addUniqueOwner(address _owner) internal {
        if(isOwner[_owner] == false) {
            owners.push(_owner);
            isOwner[_owner] = true;
        }
    }


    // return airlines array
    function getAirlines() public view returns (string[] memory) {
        return airlines;
    }


    // return owner array
    function getOwners() public view returns (address[] memory) {
        return owners;
    }
}