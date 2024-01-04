import React from 'react'
import { useBalance } from 'wagmi'

const Balance = ({address}) => {
    const {data,isLoading} = useBalance({
        address 
    })
  if (isLoading) return (<div>...</div>)
  return(
    <div>
        {data.formatted} ETH
    </div>

  )
}

export default Balance