pragma solidity ^0.8.17;

contract FlightDelay {

    struct Insurance {
        string airline;
        string flight_number;
        string departure_date;
        bool delay_status;
        string payment_status;
    }

    string [] public airlines;
    
    mapping (string => bool) public isAirline;
    mapping (address => Insurance) public insurances;

    function createInsurance(address _owner, string memory _airline, string memory _flight_number, string memory _departure_date) public {
        _addUniqueAirline(_airline);

        // create user insurance data
        insurances[_owner] = Insurance({
            airline: _airline,
            flight_number: _flight_number,
            departure_date: _departure_date,
            delay_status: false,
            payment_status: "un_paid"
        });
    }


    // get insurance data by user address
    function getInsurance(address _owner) public view returns(string memory, string memory, string memory, bool, string memory) {
        return (
            insurances[_owner].airline, 
            insurances[_owner].flight_number, 
            insurances[_owner].departure_date, 
            insurances[_owner].delay_status, 
            insurances[_owner].payment_status
        );
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


    // return airlines array
    function getAirlines() public view returns (string[] memory) {
        return airlines;
    }
}