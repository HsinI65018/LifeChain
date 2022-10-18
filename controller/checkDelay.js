const Web3 = require("web3");
const ABI = require("../build/contracts/FlightDelay.json").abi;
const contractAddress = "0xE7c50F6b35e353CaaaD67b43B5Cb280cc0405EC2";

let web3;
let contract;
let contractOwner;
const createInstance = async () => {
    web3 = new Web3("http://127.0.0.1:7545");
    contract = new web3.eth.Contract(ABI, contractAddress);

    const accounts = await web3.eth.getAccounts();
    contractOwner = await accounts[0];

    const tokenResponse = await fetch('http://127.0.0.1:3000/api/flight/token', {
        method: "POST"
    })
    const token = await tokenResponse.json();

    const owners = await contract.methods.getOwners().call();
    const ownerIds = [];
    for(let i = 0; i < owners.length; i ++) {
        const ids = await contract.methods.getInsuranceIds(owners[i]).call();
        for(let j = 0; j < ids.length; j ++) {
            ownerIds.push(ids[j])
        }
    }
    
    for(let i = 0; i < ownerIds.length; i ++) {
        const insuranceData = await contract.methods.getInsurance(ownerIds[i]).call();

        if(insuranceData[3] == '-') {
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

            if(delayData[0].ScheduleDepartureTime && delayData[0].ActualDepartureTime) {
                const delayTime = await calculateDelayTime(delayData[0], 'ScheduleDepartureTime', 'ActualDepartureTime');
                checkDelayTime(delayTime, ownerIds[i]);
            } else if(delayData[0].ScheduleArrivalTime && delayData[0].ActualArrivalTime) {
                const delayTime = await calculateDelayTime(delayData[0], 'ScheduleArrivalTime', 'ActualArrivalTime');
                checkDelayTime(delayTime, ownerIds[i]);
            }
        }
    }
}

// calculate delay time
const calculateDelayTime = async (delayData, ScheduleTime, ActualTime) => {

    const scheduleTime = delayData[ScheduleTime].split("T")[1];
    const actualTime = delayData[ActualTime].split("T")[1];
    const [ scheduleHours, scheduleSecs ] = scheduleTime.split(':');
    const [ actualHours, actualSecs ] = actualTime.split(':');

    if(actualHours >= scheduleHours) {
        let delayHours;
        let delaySecs;
        if(actualSecs >= scheduleSecs) {
            delayHours = parseInt(actualHours) - parseInt(scheduleHours);
            delaySecs = parseInt(actualSecs) - parseInt(scheduleSecs);
        } else{
            delayHours = parseInt(actualHours) - parseInt(scheduleHours) - 1;
            delaySecs = 60 - parseInt(scheduleSecs) + parseInt(actualSecs);
        }
        return (delayHours * 60 + delaySecs);
    }
};

// update insurance data depends on different delay time
const checkDelayTime = async (delayTime, id) => {
    // if(delayTime >= 60 && delayTime <= 120)
    if(delayTime >= 30 && delayTime <= 60) {
        await updateInsuranceData(id, "Delay", "0.050 eth", 0.050);
    } else if(delayTime >= 120 && delayTime <= 180) {
        await updateInsuranceData(id,"Delay", "0.056 eth", 0.056);
    } else if(delayTime >= 180 && delayTime <= 240) {
        await updateInsuranceData(id,"Delay", "0.060 eth", 0.060);
    } else if(delayTime >= 240) {
        await updateInsuranceData(id,"Delay", "0.064 eth", 0.064);
    } else {
        await updateInsuranceData(id,"On Time", "Un Paid", 0);
    }
}

// call contract to update the insurance data
const updateInsuranceData = async (id, status, payment, amount) => {
    const ether = web3.utils.toHex(web3.utils.toWei((amount).toString(), 'ether'));
    await contract.methods.updateInsurance(id, status, payment, ether).send({
        from: contractOwner,
        to: contractAddress,
        value: 0,
    });
}


// start checking
setInterval(() => {
    createInstance()
}, 1000);


module.exports = createInstance;