// click the inaure now btn, scroll down to the insure form
const insureNowBtn = document.querySelector('.banner-info-btn');
const scrollPageController = () => {
    window.scrollTo(900, 900);
}
insureNowBtn.addEventListener('click', scrollPageController);


// create contract instance
let contract;
let userAccount;
const createInstance = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
    const contractAddress = "0x1271175735C572a55876D94E008e968810dbAeeD";
    const response = await fetch('/api/read/file');
    const data = await response.json();
    const ABI = data.data
    contract = new web3.eth.Contract(ABI, contractAddress);
    // console.log(contract)
    const accounts = await web3.eth.getAccounts();
    userAccount = await accounts[0]


    //// TEST
    const airline = await contract.methods.getAirlines().call();
    console.log(airline)
    ////
    
}
window.addEventListener('load', createInstance);


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
            to: "",
            value: 0,
        });
        
        if(transcation.status) {
            airline.value = '';
            flightNumber.value = '';
            departureDate.value = '';
        }   
    }else{
        errorContainer.style.display = 'flex';
        errorContainer.classList.add('show-animation');
    }
}
form.addEventListener('submit', orderInsuranceController);


// check if the flight is exist
async function checkFlightNumber(departureDate, airline, number) {   
    const flightNumber = "'" + airline + number + "'";
    const url = `https://tdx.transportdata.tw/api/basic/v2/Air/GeneralSchedule/International?$format=JSON&$filter=FlightNumber eq ${flightNumber}`
    const response = await fetch(url);
    const flightData = await response.json();
    // console.log(flightData)

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