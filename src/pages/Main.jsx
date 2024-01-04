import { useAccount, useSigner } from 'wagmi';
import WalletList from '../components/WalletList'


const Main = () => {
  const { isConnected } = useAccount();
  const { isFetched } = useSigner();

  if (!isConnected) {
    return <div style={{padding:20}}>Please Connect your wallet first</div>
  }

  if (isConnected && isFetched) {
    return <WalletList />
  }

}

export default Main