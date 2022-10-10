const Web3 = require("web3");
const ABI = require("../build/contracts/FlightDelay.json").abi;

const createInstance = async () => {
    const web3 = new Web3("http://127.0.0.1:7545");
    const contractAddress = "0xB06CbA431e781e7aF7F0610dE1Fa56625B9EB6cA";
    const contract = new web3.eth.Contract(ABI, contractAddress);

    const accounts = await web3.eth.getAccounts();
    const userAccount = await accounts[0];
    // console.log(accounts)
}
createInstance();


//// IDEA
//// 1. call contract to get all owner address (create a contract function to get all address)
//// 2. loop through address and get their insurance order (use getInsuranceIds and getInsurance)
//// 3. check if the insurance order flight is delay or not (match with TDX API)
//// 4. use setInterval combine above logic


module.exports = createInstance;