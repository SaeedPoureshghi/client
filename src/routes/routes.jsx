import BudgetWallet from "../pages/BudgetWallet";
import { Dashboard } from "../pages/Dashboard";
import Instant from "../pages/Instant";
import InvestWallet from "../pages/InvestWallet";
import MainLayout from "../pages/Layout";
import Main from "../pages/Main";
import MultiUserWallet from "../pages/MultiUserWallet";


export const mainroutes = [
    {
        path: '/',
        element : <MainLayout/>,
        children : [
            {path: '/',element :<Main/> },
            {path: '/dashboard',element: <Dashboard/>},
            {path: '/instant',element: <Instant/>},
            {path: '/budget',element: <BudgetWallet/>},
            {path: '/invest',element: <InvestWallet/>},
            {path: '/multiuser',element: <MultiUserWallet/>},
        ]
    }
]