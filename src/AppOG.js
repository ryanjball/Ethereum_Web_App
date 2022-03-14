import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import waveportal from "./utils/WavePortal.json"

const App = () => {

  const [currentAccount,setCurrentAccount] = useState("");
  const [userInput, setUserInput] = useState("");

  //const contractAddress = "0x3F1f44c7045ee31893E499717BD0F9AbCA04083d"
  const [allWaves,setAllWaves] = useState([])
  //const contractAddress = //"0x82268B7F864463FeA94eb6a22573e08A1ffF7394"
  //const contractAddress = //"0x7656732651104cB9EC5113BaF5Af9740A9484f04"
  const contractAddress = "0x26bB5e5D07553ec9583f9FC31c2ee415b2b99fBb"
  
  const getAllWaves = async () => {
    try {
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, waveportal.abi,signer);
        /*
        call the getallwaves method 
        */
        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];

        waves.forEach(wave => 
          {wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp*1000),
            message: wave.message
        })
      });
      setAllWaves(wavesCleaned);
      console.log("cleaned", wavesCleaned)
    
      wavePortalContract.on("NewWave",(from,timestamp,message) => {console.log("NewWave",from,timestamp,message);

        setAllWaves(prevState => [...prevState, {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message
        }]);

      });
      } else {
        console.log("ethereum object doesn't exist!")
      
      }
    }  catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {

      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({method: 'eth_accounts'});

      if (accounts.length!== 0) {
        const account = accounts[0];
        console.log("found an authorized account:",account);
        setCurrentAccount(account)
        getAllWaves();
         //After connecting the wallet and authorizing the user, show the waves
        //getAllWaves();
      } else {
        console.log("no authorized account found");
      }
    } catch(error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }


  const wave = async () => {
    try {
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveportalContract = new ethers.Contract(contractAddress,waveportal.abi,signer);

        let count = await waveportalContract.getTotalWaves();
        console.log("Retrieved total wave count",count.toNumber());
        
        //execute the actual wave from smart contract//
        const waveTxn = await waveportalContract.wave(userInput,{gasLimit:300000});
      
        console.log('mining...',waveTxn.hash);
        //move();
        await waveTxn.wait();
        console.log('mined...',waveTxn.hash);
        count = await waveportalContract.getTotalWaves();
        console.log('Retrieved total wave count',count.toNumber());
        //getAllWaves()


      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  })



  

  var i = 0;
  function move() {
    if (i === 0) {
      i = 1;
      var elem = document.getElementById("myBar");
      var width = 1;
      var id = setInterval(frame, 80);
      function frame() {
        if (width >= 100) {
          clearInterval(id);
          i = 0;
        } else {
          width++;
          elem.style.width = width + "%";
        }
      }
    }
  }
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          Yooo it's Ball! Connect your Ethereum Wallet and wave at me!
        </div>

        

        <div className="textArea"> 
          <textarea className="textbox" rows ="4" cols = "32" onChange={e => setUserInput(e.target.value)} value={userInput}> lfgggg!!
          </textarea>
        </div> 
        
        <button className="waveButton" onClick={wave}>
          Submit!
        </button>

        {!currentAccount && (
          <button className = "connectButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave,index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}

      </div>
    </div>
  );
}

export default App


// We'll start looking here
        // so we need to create the userInput, then connect that to the textarea, then we need to pass that info into our wave funciton, and finally pass that into the waveportalContract to be logged.. oh
        
        // Close. Your logic is correct but react holds our hand and does all of this almost by itself.
        // Quick react: const [userInput, setUserInput] = useState("")
        // That line creates a variable "userInput" the same as "let userInput = ''"
        // setUserInput basically creates a function function setUserInput()
        // Since we called setUserInput to update every new change all we have to do is reference userInput here :) 

        // userInput - no need to braces because we're in JS not JSX
        // For what it's worth, I come from Vue(which uses regular JS so react is icky to me haha)