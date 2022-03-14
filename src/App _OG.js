import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json"

const App = () => {

  const [currentAccount,setCurrentAccount] = useState("");
  const contractAddress = "0x3F1f44c7045ee31893E499717BD0F9AbCA04083d"
  
  const contractABI = abi.abi


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
        const waveportalContract = new ethers.Contract(contractAddress,contractABI,signer);

        let count = await waveportalContract.getTotalWaves();
        console.log("Retrieved total wave count",count.toNumber());
        
        //execute the actual wave from smart contract//
        const waveTxn = await waveportalContract.wave();
        console.log('mining...',waveTxn.hash);
        move();
        await waveTxn.wait();
        console.log('mined...',waveTxn.hash);
        count = await waveportalContract.getTotalWaves();
        console.log('Retrieved total wave count',count.toNumber());


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
    if (i == 0) {
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

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className = "waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        <div id="myProgress">
          <div id ="myBar"></div>
        </div>
        
        
      </div>
    </div>
  );
}

export default App

