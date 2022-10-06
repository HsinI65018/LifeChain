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
    const contractAddress = "0x6f8De0f1c116478d95eb0d0bd22A51E6622B8560";
    const response = await fetch('/api/read/file');
    const data = await response.json();
    const ABI = data.data
    contract = new web3.eth.Contract(ABI, contractAddress);

    const accounts = await web3.eth.getAccounts();
    userAccount = await accounts[0]


    //// TEST
    const airline = await contract.methods.getAirlines().call();
    console.log(airline)
    const ids = await contract.methods.getInsuranceIds(userAccount).call();
    console.log(ids)
    for(let i = 0; i < ids.length; i ++) {
        let insurance = await contract.methods.getInsurance(ids[i]).call();
        console.log(insurance)
    }
    ////
    
}
window.addEventListener('load', createInstance);


// saveing insurance data to block-chain
const form = document.querySelector('form');
const orderInsuranceController = async (e) => {
    e.preventDefault();
    const airline = document.querySelector('.airline').value;
    const flightNumber = document.querySelector('.flight-number').value;
    const departureDate = document.querySelector('.daparture-date').value;

    contract.methods.createInsurance(userAccount, airline, flightNumber, departureDate).send({
        from: userAccount,
        to: "",
        value: 0,
    });
}
form.addEventListener('submit', orderInsuranceController);
