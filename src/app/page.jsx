'use client'
import { useState } from "react";
import {ethers , ContractFactory} from 'ethers';
import tokenJson from './token.json'


export default function Home() {
  const [tokenData , setTokenData] = useState({
    name:'',
    ticker:'',
    decimals:'',
    totalSupply:''
  })

  const [deploying , setDeploying] = useState(false);

  // once the sc is deployed show them a link to see which transaction it was exactly
  const [deployment , setDeployment] = useState(undefined);
  const [error , setError] = useState(false);

  const handleInputChange = e =>{
    const {name , value} = e.target;
    setTokenData({
      ...tokenData,
      [name]:value
    });
    // since we only want to change the value that has been changed
  }

    const deployToken = async() =>{
      console.log('deploy token');
      console.log('token data');

      // 1.Connect to metamask with ethers
      const provider = new ethers.BrowserProvider(window.ethereum);
      // with this we can interact with the blockchain via metamask
      const signer = await provider.getSigner();
      // connecting to metamask but only the first time


      // show feedback to users
      setDeploying(true);



      // 2.Create the deployment transaction
      // we need an object that represent our token
      const token = new ContractFactory(tokenJson.abi , tokenJson.bytecode);
      // we have created a transaction which is unsigned
      const tx = await token.getDeployTransaction(
        tokenData.name ,
        tokenData.ticker,
        tokenData.decimals,
        ethers.parseUnits(tokenData.totalSupply.toString(), parseInt(tokenData.decimals))
      )
      const txRequest = {
        // from => Metamask 
        // to => ''
        // value: 
        // signature --> this will be created by metamask 
        // nonce: 
        // gas 
        // data --> allows to interact with sc or deploy a sc this is where we will put the code of new sc 

        data: tx.data
      }
      // ContractFactory takes 2 things ABI  and Bytecode
      // abi is a json object that defines the interface of the smart contract
      // byteCode --> code on the smartContract
      // now with the help of this token we can create a deployment transaction

      // solidity --> EVMByte code and then it is deployed on the BC


      // 3.Send the transaction
      let txReceipt;
      try{
        // send a transaction
        const txResponse = await  signer.sendTransaction(txRequest);
        txReceipt = await txResponse.wait()
        setDeploying(false)
        setDeployment({hash: txReceipt.hash , address: txReceipt.contractAddress});
      } catch(e){
        setDeploying(false);
        setError(true);
      }



      // 4. Verification --> Verify the contract
      const apiKey = "";
      const abiCoder = new ethers.AbiCoder();
      const constructorArguements = abiCoder.encode(
        ["string" , "string" , "uint8" , "uint256"],
        [tokenData.name , tokenData.ticker , tokenData.decimals , tokenData.totalSupply]
      )
      const reponse = await fetch(
        '//api-sepolia.etherscan.io/api',
        {
          method: "POST",
          headers: {
            // what kind of data we are providing and what kind of data we are accepting
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body: {
            apiKey,
            module: 'contract',
            action: 'verifysourcecode',
            contractAddress:txReceipt.address,
            sourceCode: tokenJson.code,
            
            contractname:"ERC20Token",
            compilerversion: tokenJson.compilerversion,
            optimizationUsed: 0,
            
            constructorArguements: constructorArguements,
            evmversion: tokenJson.evmVersion,
            licenseType: tokenJson.licenseType,
            
          }
        }
      ); 

    }

  return (
    <>
    <div className='container-fluid mt-5 d-flex justify-content-center'>
      <div id='content' className='row'>
      <div id='content-id' className='col'>
        <div className='text-center'>
      <h1 id='title' className='fw-bold'>
        MEME COIN GENERATOR
      </h1>
      <p id='sub-title' className='mt-4 fw-bold'><span>Generate your meme coin in 1 minute <br/> without any coding </span> </p>

      {/* metadata */}
      <h2 className='fs-5 mt-4 fw-bold'>Metadata</h2>
      <div className='form-group'>
        <label >Token Name</label>
        <input type="text" className='form-control' placeholder='Enter token name' name='name' value={tokenData.name} onChange={handleInputChange} />
      </div>


      <div className='form-group'>
        <label >Token Ticker</label>
        <input type="text" className='form-control' placeholder='Ticker' name='ticker' value={tokenData.ticker} onChange={handleInputChange} />
      </div>


      {/* tokenomics */}
      <h2 className='fs-5 mt-4 fw-bold'>Tokenomics</h2>
      <div className='form-group'>
        <label >Decimals</label>
        <input type="number" className='form-control' placeholder='Decimals' name='decimals' value={tokenData.decimals} onChange={handleInputChange}  />
      </div>


      <div className='form-group'>
        <label >Total Supply</label>
        <input type="number" className='form-control' placeholder='Total Supply' name='totalSupply' value={tokenData.totalSupply} onChange={handleInputChange}  />
      </div>

      <button className='btn btn-primary mt-4 ' onClick={deployToken} disabled={deploying}>
      Deploy Token
      </button>
      
      {/* if this is true then do this */}
      {deploying && <div className='alert alert-info mt-4 mb-0'>Your meme coin is being deployed . Please wait until the transaction is mined</div>}
      {deployment &&  <div className='alert alert-success mt-4 mb-0'>Congrats the meme coin was deployed at <a href={`https://sepolia.basescan.org/tx/${deployment.hash}`} target='_blank'>
      
      {`${deployment.hash.substr(0,20)}...`}

      </a></div>}
      {error && <div className='alert alert-danger mt-4 mb-0'>OOps there was a problem. Your memecoin was not deployed Please try again later</div>}
      </div>
      </div>
      </div>
    </div>
    </>
  );
}
