import createInstance from "./instance.js";

// create contract instance
let contract;
let userAccount;
const initContractInstance = async () => {
    contract = (await createInstance()).contract;
    userAccount = (await createInstance()).userAccount;
}
window.addEventListener('load', initContractInstance);


// show user insurance details
const ethereumButton = document.querySelector('.navbar-connect-wallet-btn');
const connectBtn = document.querySelector('.description-btn');
const main = document.querySelector('main');
const listTitle = document.querySelector('.order-list-title');
const listItemContainer = document.querySelector('.order-list-item-container');
const connectToWallet = async () => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if(accounts[0].length !== 0) {
        ethereumButton.textContent = accounts[0].slice(0, 18) + '...';
        userAccount = accounts[0];

        listTitle.classList.remove('hide');
        main.style.borderBottom = '1px solid #D8D3D3';
        listItemContainer.innerHTML = '';
        const ids = await contract.methods.getInsuranceIds(userAccount).call();
        for(let i = 0; i < ids.length; i ++) {
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('order-list-item');
            let insuranceData = await contract.methods.getInsurance(ids[i]).call();
            for(let j = 0; j < insuranceData.length; j ++) {
                const item = document.createElement('div');
                item.textContent = insuranceData[j]
                itemContainer.appendChild(item);
            }
            listItemContainer.appendChild(itemContainer);
        }
    }
}
connectBtn.addEventListener('click', connectToWallet);