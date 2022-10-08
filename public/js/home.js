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
    const contractAddress = "0x78E49a7Eb5c63375f0E909d3e0F9c61c7d460651";
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
    const trans = await web3.eth.getTransaction("");
    console.log(trans)
    ////
    
}
window.addEventListener('load', createInstance);


// saveing insurance data to block-chain
const form = document.querySelector('form');
const orderInsuranceController = async (e) => {
    e.preventDefault();
    const airline = document.querySelector('.airline');
    const flightNumber = document.querySelector('.flight-number');
    const departureDate = document.querySelector('.daparture-date');

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
    
}
form.addEventListener('submit', orderInsuranceController);
