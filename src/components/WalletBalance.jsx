import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Progress, Spin, Tag ,Card} from 'antd'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { useContract, useNetwork, useSigner } from 'wagmi'
import ABI from '../build/InstantWallet.json'

const WalletBalance = ({ address ,target = 'balance',useraddress = null}) => {

  const [balance, setBalance] = useState()
  const [status, setStatus] = useState()
  const [percent, setPercent] = useState()
 const [name, setName] = useState()
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const WalletContract = {
    address: address,
    abi: ABI.abi,
    signerOrProvider: signer

  }
  const etherContract = useContract(WalletContract)
  const {Meta} = Card;

  useEffect(() => {

    async function getData() {
      await etherContract.getWallet()
        .then((res) => {
          setStatus(res._status);
          setBalance(res._total.toString())
         
          if (useraddress) {
            const index = res._list.findIndex(i => i == useraddress);
            setPercent(res._percent[index].toString())
            setName(res._name);
          }
        })
    }
    getData();
  }, [])
  if (target == 'balance') {

    
    return (
      <div>
      {
        (typeof balance !== 'undefined' && typeof status !== 'undefined') ? 
        
        <>
       {ethers.utils.formatEther(balance)} <span style={{fontSize:'medium'}}>{chain.nativeCurrency.symbol} </span>
      
      <Tag
       icon={!status ? <CheckCircleOutlined/>:<CloseCircleOutlined/>}
       style={{margin:'0 10px'}}
       color={status ? 'error':'success'}
       ></Tag>
      </>
       : 
       <Spin/>
       }
       </div>
  )
}
if (target == 'percent') {
  return(
    <>
    {typeof percent !== 'undefined' && 
     <Meta
              
     avatar={<Progress percent={percent} type="circle" size={'small'}/>}
     title = {name}
     description={address}
     />
    
  
    }
    </>
  )
}
}

export default WalletBalance