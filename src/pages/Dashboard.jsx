import { Divider, List, Progress, Skeleton, Table, Tag } from 'antd';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAccount,  useContractRead, useNetwork,useSigner } from 'wagmi';
import ABI from '../build/InstantWallet.json'

export const Dashboard = () => {
    const { state } = useLocation();
    // eslint-disable-next-line no-unused-vars
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const { data: signer } = useSigner();
    const [dataLoaded, setDataLoaded] = useState(false)
    const [shareData, setShareData] = useState([])
    // const { Text } = Typography;

    const contract = {
        address: state.waddress,
        abi: ABI.abi,
        overrides: { from: address },
        signerOrProvider: signer
    }


    const { data: walletList, isLoading, isFetched: walletFetched } = useContractRead(
        {
            ...contract,
            functionName: 'getWallet'
        }
    )
    const { data: transactions, isLoading: transLoading, isFetched: transFetched } = useContractRead({
        ...contract,
        functionName: 'getTransactions'
    })


    useEffect(() => {
        if (walletFetched && transFetched) {
            let dt = [];
            walletList._list.map((item, index) => {
                dt.push({ _address: item, _percent: walletList._percent[index].toString() })
            })
            setShareData(dt);
            setDataLoaded(true)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, transLoading])


    function formatedAddress(_address) {
        return _address.substr(0, 5) + '...' + _address.substr(-5, 5);
    }
    // const shareColumns = [
    //     {
    //         title: 'Address',
    //         dataIndex: '_address',
    //         key: 'address',
    //         render: (text) => {
    //             if (text === address) return <Text strong type='success'>{text}</Text>
    //             return <div>{text}</div>
    //         }
    //     },
    //     {
    //         title: 'Percent',
    //         dataIndex: '_percent',
    //         key: 'percent',
    //         render: (text) => <Progress percent={text} />
    //     }
    // ]

    const transactionColumns = [
        {
            title: 'From',
            dataIndex: '_from',
            key: 'from',
            render: (text) => {

                if (text === state.waddress) return <><b>{walletList._name}</b>({formatedAddress(state.waddress)})</>

                return text

            }
        },
        {
            title: 'To',
            dataIndex: '_to',
            key: 'to',
            render: (text) => {

                const isShared = walletList._list.filter(i => i === text).length;
                if (text === state.waddress) return <><b>{walletList._name}</b>({formatedAddress(state.waddress)})</>
                if (isShared > 0) return <><b>Shared Address</b>({formatedAddress(text)})</>
                return text

            }
        },
        {
            title: '',
            dataIndex: '_side',
            key: 'side',
            render: (text) => <Tag color={text === 'IN' ? 'success' : 'error'} >{text}</Tag>
        },
        {
            title: 'Amount',
            dataIndex: '_amount',
            key: 'amount',
            render: (text) => <div>{ethers.utils.formatEther(text)} {chain.nativeCurrency.symbol}</div>
        },
    ]

    if (dataLoaded) {
        return (
            <>

                <List
                    header={<div>{walletList._name} ({state.waddress})</div>}
                                    itemLayout="horizontal"
                    dataSource={shareData}
                    renderItem={(item, index) => (
                        <List.Item key={index}>
                            <List.Item.Meta
                                avatar={<Progress type='circle' size={'small'} percent={item._percent}/>}
                                title={item._address}
                                // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </List.Item>
                    )}
                />
 
                <Divider orientation='left'>Transactions</Divider>
                <Table
                    size='small'
                    
                    scroll={{x: 1000,y:1000 }}
                    dataSource={transactions}
                    columns={transactionColumns}

                />


            </>
        )
    }
    return (
        <>
            <Skeleton />

        </>

    )
}
