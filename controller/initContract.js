const Web3 = require("web3");
const ABI = require("../build/contracts/FlightDelay.json").abi;

const initContractBalance = async () => {
    const web3 = new Web3("http://127.0.0.1:7545");
    const contractAddress = "0x27D93A5E2F32914ed6D790A5d4A7F3b8f9D73CC5";
    const contract = new web3.eth.Contract(ABI, contractAddress);

    const accounts = await web3.eth.getAccounts();
    const contractOwner = await accounts[0];

    contract.methods.initBalance().send({
        from: contractOwner,
        to: contractAddress,
        value: web3.utils.toHex(web3.utils.toWei(('50').toString(), 'ether'))
    })
}

initContractBalance();

module.exports = initContractBalance;