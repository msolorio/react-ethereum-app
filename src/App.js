import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import './App.css';

const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

function App() {
  const [inputVal, setInputVal] = useState('');
  const [greetingDisplay, setGreetingDisplay] = useState('');

  useEffect(() => {
    fetchGreeting()
      .then((greeting) => {
        setGreetingDisplay(greeting);
      });
  }, []);

  const handleInputChange = (event) => {
    setInputVal(event.target.value);
  }


  // request access to the user's MetaMask account
  // - Why do we do this ?
  // - Where does that account info go after we request it ?
  // Looks like we don't need to explicitly call .request to request access
  // happens automatically
  // async function requestAccount() {
  //   await window.ethereum.request({ method: 'eth_requestAccounts' });
  // }


  const fetchGreeting = async () => {
    if (typeof window.ethereum === 'undefined') return;

    // What is the provider / Web3 Provider ?
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Gives us access to the contract instance
    // Why do we pass the provider to the contract constructor
    const contract = new ethers.Contract(contractAddress, Greeter.abi, provider);
    
    try {
      const greeting = await contract.greet();
      console.log('greeting:', greeting);

      return greeting;
      
    } catch(err) {
      console.log(err);
    }
  }
  
  
  const setGreeting = async () => {
    if (typeof window.ethereum === 'undefined') return; // if browser doesn't have ethereum short circuit
    if (!inputVal) return; // if input is empty short circuit

    // we don't have to request the account. Happens automatically.
    // await requestAccount();
    
    // What is the provider / Web3 Provider ?
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Does this fetch the current user's account ?
    const signer = provider.getSigner();

    // Gives us access to the contract instance
    const contract = new ethers.Contract(contractAddress, Greeter.abi, signer);

    try {
      // Invoking setGreeting on greeting contract
      // const transaction = await contract.setGreeting(inputVal);
      await contract.setGreeting(inputVal);
  
      // It looks like we don't need to wait
      // await transaction.wait();
  
      setGreetingDisplay(inputVal);
      setInputVal('');
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div className="App">
      <h1>Greeter App</h1>

      <p>Greeting: {greetingDisplay}</p>

      <input 
        type="button" 
        value="Fetch Greeting" 
        onClick={fetchGreeting}
      />

      <input
        type="button" 
        value="Set Greeting"
        onClick={setGreeting}
      />

      <br/>
      <br/>

      <input
        type="text" 
        value={inputVal}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default App;
