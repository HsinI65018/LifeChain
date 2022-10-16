import createInstance from "./instance.js";

// click the inaure now btn, scroll down to the insure form
const insureNowBtn = document.querySelector('.banner-info-btn');
const scrollPageController = () => {
    window.scrollTo(900, 900);
}
insureNowBtn.addEventListener('click', scrollPageController);


// create contract instance
let web3;
let contract;
let userAccount;
const initContractInstance = async () => {
    web3 = (await createInstance()).web3;
    contract = (await createInstance()).contract;
    userAccount = (await createInstance()).userAccount;

    //// TEST!!!
    // await contract.methods.toContract().send({
    //     from: userAccount,
    //     to: "0x24F8e5A258717F40EFf54F2C1DACA94f83392Adc",
    //     value: web3.utils.toHex(web3.utils.toWei(('1').toString(), 'ether'))
    // })

    const balance = await contract.methods.getBalance().call();
    console.log(balance)
}
window.addEventListener('load', initContractInstance);


// saveing insurance data to block-chain
const form = document.querySelector('form');
const errorContainer = document.querySelector('.error-container');
const orderInsuranceController = async (e) => {
    e.preventDefault();

    if(userAccount == undefined) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
    }

    const airline = document.querySelector('.airline');
    const flightNumber = document.querySelector('.flight-number');
    const departureDate = document.querySelector('.daparture-date');

    const checkFlightResult = await checkFlightNumber(departureDate.value, airline.value, flightNumber.value);
    if(checkFlightResult){
        const transcation = await contract.methods.createInsurance(userAccount, airline.value, flightNumber.value, departureDate.value).send({
            from: userAccount,
            to: "0x24F8e5A258717F40EFf54F2C1DACA94f83392Adc",
            value: web3.utils.toHex(web3.utils.toWei(('0.05').toString(), 'ether'))
        });
        
        if(transcation.status) {
            airline.value = '';
            flightNumber.value = '';
            departureDate.value = '';
        }
    }else{
        errorContainer.style.display = 'flex';
        errorContainer.classList.add('show-animation');
        
        if(transcation.status) {
            airline.value = '';
            flightNumber.value = '';
            departureDate.value = '';
        }
    }
}
form.addEventListener('submit', orderInsuranceController);


// check if the flight is exist
async function checkFlightNumber(departureDate, airline, number) {   
    const flightNumber = "'" + airline + number + "'";
    const tokenResponse = await fetch('/api/flight/token', {
        method: "POST"
    })
    const token = await tokenResponse.json();
    const url = `https://tdx.transportdata.tw/api/basic/v2/Air/GeneralSchedule/International?$format=JSON&$filter=FlightNumber eq ${flightNumber}`
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "authorization": "Bearer " + token.access_token
        }
    });
    const flightData = await response.json();
    console.log(flightData)

    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    for(let i = flightData.length - 1; i >= 0; i --) {
        const startDate = flightData[i].ScheduleStartDate;
        const endDate = flightData[i].ScheduleEndDate;
        if(departureDate >= startDate && departureDate <= endDate) {
            console.log(i, flightData[i])
            const date = new Date(departureDate)
            const day = date.getDay();
            console.log(weekdays[day])
            const flightStatus = flightData[i][`${weekdays[day]}`];
            return flightStatus
        }
    }
}