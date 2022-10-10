const createInstance = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
    const contractAddress = "0xB06CbA431e781e7aF7F0610dE1Fa56625B9EB6cA";
    const response = await fetch('/api/read/file');
    const data = await response.json();
    const ABI = data.data
    const contract = new web3.eth.Contract(ABI, contractAddress);

    const accounts = await web3.eth.getAccounts();
    const userAccount = await accounts[0];

    return {
        "web3": web3,
        "contract": contract,
        "userAccount": userAccount
    }
}

export default createInstance;