const Web3 = require("web3");
const ABI = require("../build/contracts/FlightDelay.json").abi;

const createInstance = async () => {
    const web3 = new Web3("http://127.0.0.1:7545");
    const contractAddress = "0x5aca6b486cc672100b132408D9ACfF1250125268";
    const contract = new web3.eth.Contract(ABI, contractAddress);

    const accounts = await web3.eth.getAccounts();
    const userAccount = await accounts[0];
    // console.log(accounts)

    const tokenResponse = await fetch('http://127.0.0.1:3000/api/flight/token', {
        method: "POST"
    })
    const token = await tokenResponse.json();
    // console.log(token.access_token)
    
    const owners = await contract.methods.getOwners().call();
    for(let i = 0; i < owners.length; i ++) {
        const ownerIds = await contract.methods.getInsuranceIds(owners[i]).call();
        for(let j = 0; j < ownerIds.length; j ++) {
            const insuranceData = await contract.methods.getInsurance(ownerIds[j]).call();

            const airline = "'" + insuranceData[0] + "'";
            const flightNumber = "'" + insuranceData[1] + "'";

            const url = `https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Flight?$format=JSON&$filter=AirlineID eq ${airline} and FlightNumber eq ${flightNumber}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "authorization": "Bearer " + token.access_token
                }
            })
            const delayData = await response.json();
            // console.log(delayData)

            if(delayData[0].ScheduleArrivalTime) {
                if(delayData[0].ActualArrivalTime > delayData[0].ScheduleArrivalTime) {
                    const [scheduleDate, scheduleTime] = delayData[0].ScheduleArrivalTime.split("T");
                    const [actualDate, actualTime] = delayData[0].ActualArrivalTime.split("T");
                    const [scheduleHours, scheduleMins] = scheduleTime.split(':');
                    const [actualHours, actualMins] = actualTime.split(':');
                    console.log((parseInt(actualHours) - 12 ) * 60 + parseInt(actualMins));
                    console.log((parseInt(scheduleHours) - 12 ) * 60 + parseInt(scheduleMins));
                    console.log(((parseInt(actualHours) - 12 ) * 60 + parseInt(actualMins)) - ((parseInt(scheduleHours) - 12 ) * 60 + parseInt(scheduleMins)))
                    console.log('-------------------------')
                }
            } else if(delayData[0].ScheduleDepartureTime) {
                if(delayData[0].ActualDepartureTime > delayData[0].ScheduleDepartureTime) {

                }
            }
        }
    }
}
createInstance();


//// IDEA
//// 1. call contract to get all owner address (create a contract function to get all address)
//// 2. loop through address and get their insurance order (use getInsuranceIds and getInsurance)
//// 3. check if the insurance order flight is delay or not (match with TDX API)
//// 4. use setInterval combine above logic


module.exports = createInstance;