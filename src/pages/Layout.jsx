import { Link, Outlet, useLocation } from 'react-router-dom'
import { Web3Button } from '@web3modal/react'
import { Breadcrumb, Layout } from 'antd'
import Logo from '../assets/just_logo.png'


function MainLayout() {

  const { Header, Content } = Layout;
  const location = useLocation();


  const breadcrumbMap = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/instant': 'Instant Wallet',
    '/budget': 'Budget Wallet'

  }
  const pathSnippets = location.pathname.split('/').filter((i) => i)
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return {
      key: url,
      title: (url === '/dashboard') ? breadcrumbMap[url] : <Link to={url}>{breadcrumbMap[url]}</Link>
    };
  });
  const breadcrumbItems = [
    {
      title: <Link to="/">Home</Link>,
      key: 'home',
    },
  ].concat(extraBreadcrumbItems);

  return (

    <Layout style={{ minHeight: '100vh' }}>

      <Layout style={{ background: '#FFFADE' }}>
        <Header className='myheader' style={{ background: '#FFFADE', minHeight:100,  display: 'flex', alignItems: 'center' }}        
        >
          <div>
            <img className='titleImg' src={Logo} />
          </div>


          <div>
            <h1 className='title'>ProRata Wallet</h1>
          </div>

          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
            <Web3Button icon='hide' label='Connect' />
          </div>



        </Header>
        <div style={{padding:10}}>
        <Breadcrumb items={breadcrumbItems} />
        </div>
        <Content

        >
          <div style={{ padding: "10px 20px" }}>
            <Outlet />
          </div>
        </Content>
      </Layout>

    </Layout>

  )
}

export default MainLayout