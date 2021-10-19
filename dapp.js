const contractAddress = '0xf8F3EC333a768685CcA8c31efB1ea3F132382681'

const ABI = [
    {
        "inputs": [],
        "name": "retrieve",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "num",
                "type": "uint256"
            }
        ],
        "name": "store",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

//check if we have metamask extension installed once page is loaded
window.addEventListener('load', function () {
    if (typeof window.ethereum == 'undefined') {
        let noMeta = document.getElementById('metaNotInstalled');
        noMeta.innerHTML += 'Please install MetaMask! Not detected.'
    }
})

//instatiate web3 with Metamask (which is window.ethereum)
var web3 = new Web3(window.ethereum)

// instantiate smart contract instance
const simpleStorage = new web3.eth.Contract(ABI, contractAddress)

//create Connect button handler
let connectButton = document.getElementById('connect-button');
connectButton.onclick = async () => {
    //connect to Metamask
    await ethereum.request({ method: 'eth_requestAccounts' });

    //display address on UI
    let connectedAddress = document.getElementById('connected-address');
    connectedAddress.innerHTML += 'Connected: ' + ethereum.selectedAddress;
}

//create submit button handler
let submitButton = document.getElementById("submit-button");
submitButton.onclick = async () => {

    var txHash = "";

    //reset success message to blank
    let success = document.getElementById("success-message");
    success.innerHTML = "";

    //inputted value
    const newNumber = document.getElementById('number').value;

    //check if they are connected to MM
    if (ethereum.selectedAddress === null) {
        const notConnected = document.getElementById('not-connected');
        notConnected.innerHTML = "Please connect your Meta Mask Wallet.";
    }
    else { //they are connected
        //call the contract Store method from connected account
        await simpleStorage.methods.store(newNumber).send({ from: ethereum.selectedAddress })
            .once('transactionHash', (hash) => {
                console.log(typeof hash);
                txHash = hash;
            },
                (error) => {
                    console.log(error);
                }
            )
            .on('confirmation', function () {
                let success = document.getElementById("success-message");
                success.innerHTML = "Success!";
                let txHashElem = document.getElementById("transaction-hash");
                txHashElem.innerHTML = "Last Transaction Hash: " + txHash;
            })
    }
}

//display current number
let currentNumber = document.getElementById("current-number");
let getNumberButton = document.getElementById("get-number-button");

getNumberButton.onclick = async () => {
    //call the contract's retrieve() function to get latest value and display it
    let storedNumber = await simpleStorage.methods.retrieve().call();
    currentNumber.innerHTML = "The current stored value is: " + storedNumber;
}




