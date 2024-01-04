import { useEffect, useState } from "react";
import { useContract, useSigner } from "wagmi";
import ABI from '../build/ProRataDispatch.json'

const useWalletsList = ({refresh}) => {

    const [data, setData] = useState()
    const {data:signer } = useSigner();
    
    const contract = useContract({
      address: ABI.networks['5777'].address,
      abi: ABI.abi,
      signerOrProvider: signer
  
    })

      useEffect(() => {
        
        async function getData() {
            await contract.getUserWallets()
            .then((res)=>{
                setData(res)
            })
        }
        getData();
      }, [refresh])
      
 
      

      return {data}
    
}

export default useWalletsList;