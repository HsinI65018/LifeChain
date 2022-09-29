// check if the user is connected to the MetaMask wallet, if connected then show the wallet address
const ethereumButton = document.querySelector('.navbar-connect-wallet-btn');
const connectToWallet = async() => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if(accounts[0].length !== 0){
        ethereumButton.textContent = accounts[0].slice(0, 18) + '...';
        console.log(accounts[0]);
    }
}
ethereumButton.addEventListener('click', connectToWallet);


// swich to user page
const searchBtn = document.querySelector('.navbar-search-icon');
const searchController = async () => {
    window.location = '/user'
}
searchBtn.addEventListener('click', searchController);

