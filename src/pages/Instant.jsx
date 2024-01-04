import { useState } from 'react'
import ABI from '../build/ProRataFactory.json';
import "../App.css";
import { useContract, useSigner, useAccount, useNetwork } from 'wagmi';
import { Button, Col, Divider, Form, Input, Result, Row, Slider, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'

function Instant() {


  const { data: signer } = useSigner();

  const { isConnected } = useAccount();

  const { chain } = useNetwork();

  const navigate = useNavigate();
  const [Sending, setSending] = useState(false)
  const [Success, setSuccess] = useState(false)

  const contract = useContract({
    address: ABI.networks[chain.id].address,
    abi: ABI.abi,
    signerOrProvider: signer
  })





  const onFinish = async (values) => {
    let title = values.wallettitle;
    let wallets = [];
    let percents = [];
    values.address.map((item) => {
      wallets.push(item.address)
      percents.push(item.percent)
    })


    setSending(true);
    await contract.createInstantWallet(wallets, percents, title)
      .then((res) => {
        const hide = message.loading('Creating Wallet...', 0);

        res.wait().then(() => {
          setSending(false)
          hide();
          setSuccess(true);
        })
      })
      .catch((error) => {
        console.log(error)
        setSending(false);
      })
  }

  if (!isConnected) {
    return <div style={{ padding: 20 }}>Please Connect your wallet first</div>
  }

  if (Success) {
    return (
      <Result
        status="success"
        title="Successfully Created Instant Wallet!"
        subTitle="Your Instant Wallet created and ready to use!"
        extra={[
          <Button type="primary" key="console" onClick={() => navigate('/')}>
            Go Home
          </Button>,
          <Button key="buy" onClick={() => { setSuccess(false) }}>Create Another</Button>,
        ]}
      />
    )
  }

  return (
    <>
      <Divider className='divider' orientation='left'>Create an Instant Wallet</Divider>

      <Form onFinish={onFinish} layout={'vertical'}>
        <Form.Item label="Wallet Title" name="wallettitle"
          tooltip={'This title will be save on blockchain and be visible to public.'}
          required
        >

          <Input />
        </Form.Item>

        <Form.List
          name="address"
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 2) {
                  return Promise.reject(new Error('at least 2 Address required!'))
                }
              }


            }
          ]}
        >
          {(fields, { add, remove }, { errors }) => (

            <>
              {fields.map((field, index, ...restField) => (
                <Row key={field.key} gutter={16}>
                  <Col span={10}>

                    <Form.Item

                      {...restField}
                      name={[field.name, 'address']}
                      label={index === 0 ? "Address" : ''}
                      rules={
                        [
                          { required: true, message: 'Missing Address' }
                        ]
                      }
                    >

                      <Input
                        placeholder='Enter Address'

                      />
                    </Form.Item>
                  </Col>
                  <Col span={10}>

                    <Form.Item
                      {...restField}

                      label={index === 0 ? "Percent" : ''}
                      name={[field.name, 'percent']}
                      rules={[{ required: true, message: 'Missing Percent' }]}
                    >
                      {/* <InputNumber placeholder='Percent'/> */}
                      <Slider min={1} max={100}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <MinusCircleOutlined onClick={() => remove(field.name)} className="dynamic-delete-button" />
                  </Col>

                </Row>


              ))}

              <Form.Item

              >
                <Button
                  type='dashed'
                  onClick={(() => add())}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Address
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>

            </>
          )}
        </Form.List>
        <Form.Item>
          <Button htmlType='submit' loading={Sending} type="primary">Submit</Button>
        </Form.Item>


      </Form>
    </>
  )
}

export default Instant

