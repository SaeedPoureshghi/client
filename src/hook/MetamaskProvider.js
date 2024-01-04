import { createContext, useEffect, useState } from "react"
import {ethers} from 'ethers'

export const MetaMaskContext = createContext();

const MetaMaskProvider = ({children}) => {

    const ethereum = window.ethereum;
    const [account, setAccount] = useState()
    const [connected, setConnected] = useState(false)
    const [provider, setProvider] = useState()

    async function Connect() {
        if (typeof ethereum !== 'undefined') {
            const myprovider = new ethers.providers.Web3Provider(window.ethereum);
            await ethereum.request({method: 'eth_requestAccounts'})
            .then((accounts) => {
                
                setAccount(accounts[0])
                setProvider(myprovider)
                setConnected(true)
            })
        }
    }
    useEffect(() => {
      console.log('called',connected,account)
    }, [connected])
    
    return(
        <MetaMaskContext.Provider value={{account,Connect,connected,provider}}>
            {children}
        </MetaMaskContext.Provider>
    )
}

export default MetaMaskProvider