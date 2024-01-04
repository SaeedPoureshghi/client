import { Badge, Button, Card, Col, Divider, Empty, QRCode, Row, Skeleton, Tag, FloatButton } from 'antd';

import { useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom';
import { useAccount, useContract, useSigner, useNetwork } from 'wagmi';
import ABI from '../build/ProRataFactory.json'
import WalletBalance from '../components/WalletBalance'
import { PlusOutlined } from '@ant-design/icons';


function WalletList() {

  const [Loading, setLoading] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [refresh, setRefresh] = useState(false)
  const { address } = useAccount();
  const [data, setData] = useState()
  const [sdata, setSdata] = useState([])
  const { data: signer } = useSigner();
   const {chain} = useNetwork();

   
    const contract = useContract({
    address: ABI.networks[chain.id].address,
    abi: ABI.abi,
    signerOrProvider: signer

  })

  // const {
  //   token: { colorPrimaryBorder, colorPrimaryActive }
  // } = theme.useToken();

  useEffect(() => {
    async function getData() {
      await contract.getUserWallets()
        .then((res) => {
          setData(res)
        })
      await contract.getSharedWallets()
        .then((res) => {
          
          setSdata(res)
        })
    }
    setLoading(true)
    
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh])

  useEffect(() => {
    const isdatavalid = typeof data !== 'undefined';
    const issdatavalid = typeof sdata !== 'undefined';
    if (isdatavalid && issdatavalid) {
      setLoading(false)
    }
  }, [data, sdata])





  const { Meta } = Card;
  const navigate = useNavigate();

  function todash(_address) {
    navigate('/dashboard', { state: { waddress: _address } })
  }

  function toinstant() {
    navigate('/instant')
  } 

  if (Loading) return <Skeleton />

  return (
    <div>
            <FloatButton icon={<PlusOutlined />} type="primary" description='Add Wallet' shape='square' style={{width:60,height:60}} onClick={()=>toinstant()}/>

      <Divider className='divider' orientation='left'>Wallets</Divider>
      {
        data &&
        data.length == 0 &&
        <div>
          <Empty />
        </div>
      }
      <Row gutter={[16, 16]}>
        {data &&
          data.map((item, index) => {
            return (
              <Col lg={8} md={24} sm={24} key={index}>
                <Badge.Ribbon className='divider' text={item._type} placement="start">

                  <Card
                    bodyStyle={{ background: '#00C89B', borderRadius: 0 }}
                    hoverable
                    extra={<div className='balance'><WalletBalance address={item._address} /> </div>}
                    title={<div className='title' style={{ textAlign: 'center' }}>{item._name}</div>}
                    actions={[<Button key={1} className='button' onClick={() => todash(item._address)} type='primary'>To Dashboard</Button>]}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <QRCode color='white' value={item._address} />
                      <Meta style={{ padding: '10px 0' }} description={<Tag color="success">{item._address}</Tag>} />
                    </div>
                  </Card>
                </Badge.Ribbon>
              </Col>
            )

          })

        }
      </Row>

      <Divider  className='divider' orientation='left'>Wallets Have Share</Divider>


      {sdata &&

        sdata.map((item, index) => (
          <>
            <Card key={index}
             actions={[<Button key={1} className='button' onClick={() => todash(item)} type='primary'>To Dashboard</Button>]}
            >
              <WalletBalance address={item} useraddress={address} target="percent" key={index} />
            </Card>


          </>
        ))
      }

    </div>
  )
}

export default WalletList