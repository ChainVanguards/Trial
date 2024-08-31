const contractABI = [
  {
    "inputs": [],
    "name": "count",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decrement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "increment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contractAddress = "0x578E8017fDea1165FbdA373731D571147c614aa4"; // Replace with your deployed contract address

async function loadWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    console.log("Web3 has been initialized:", window.web3);  // Debugging line
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
    console.log("Web3 has been initialized:", window.web3);  // Debugging line
  } else {
    alert('Please install MetaMask!');
  }
}

async function loadContract() {
  return new window.web3.eth.Contract(contractABI, contractAddress);
}

async function load() {
  await loadWeb3();
  window.contract = await loadContract();
  console.log("Contract loaded:", window.contract);  // Debugging line
  await updateUI();
}

async function updateUI() {
  const count = await window.contract.methods.count().call();
  document.getElementById('count').innerText = count;

  const existingSquares = document.querySelectorAll('.square');
  existingSquares.forEach(square => square.remove());

  for (let i = 0; i < count; i++) {
    addRandomSquare();
  }
}

function addRandomSquare() {
  const square = document.createElement('div');
  square.classList.add('square');

  const bodyWidth = document.body.clientWidth;
  const bodyHeight = document.body.clientHeight;

  const randomX = Math.floor(Math.random() * bodyWidth);
  const randomY = Math.floor(Math.random() * bodyHeight);

  square.style.left = `${randomX}px`;
  square.style.top = `${randomY}px`;

  document.body.appendChild(square);
}

async function increment() {
  console.log("Increment function called");
  const accounts = await window.web3.eth.getAccounts();
  console.log("Accounts: ", accounts);
  
  await window.contract.methods.increment().send({ 
    from: accounts[0],
    gasPrice: await window.web3.eth.getGasPrice()  // Explicitly set the gas price
  });
  
  console.log("Transaction sent");
  await updateUI();
}

async function decrement() {
  console.log("Decrement function called");
  const accounts = await window.web3.eth.getAccounts();
  console.log("Accounts: ", accounts);
  
  await window.contract.methods.decrement().send({ 
    from: accounts[0],
    gasPrice: await window.web3.eth.getGasPrice()  // Explicitly set the gas price
  });
  
  console.log("Transaction sent");
  await updateUI();
}

load();
