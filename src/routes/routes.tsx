import { RouteConfig } from '@types';
import paths from 'common/constants/paths';
import {
    Dashboard,
    Person,
    ShoppingCart,
    Inventory,
    FormatListNumberedRtlSharp,
    Receipt,
    Assignment,
} from '@mui/icons-material';
import { User, ManageUser } from 'pages/User/Index';
import { Product } from 'pages/Product/Index';
import ManageProduct from 'pages/Product/components/ManageProduct';
import { Domain, ManageDomain } from "pages/Domain/Index";
import { Customer, ManageCustomer } from 'pages/Customer/Index';
import Account from 'pages/Account/components/Account';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FaceIcon from '@mui/icons-material/Face';

export const routes: RouteConfig[] = [
    {
        key: 'dashboard',
        description: 'Indicadores',
        tooltip: 'Indicadores',
        path: paths.DASHBOARD,
        mainView: <User />,
        icon: () => <Dashboard style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'account',
        description: 'account',
        tooltip: 'account',
        path: paths.ACCOUNT,
        mainView: <Account />,
        icon: () => <Dashboard style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'clients',
        description: 'Clientes',
        tooltip: 'Clientes',
        path: paths.CUSTOMERS,
        mainView: <Customer />,
        manageView: (baseUrl) => <ManageCustomer baseUrl={baseUrl} />,
        icon: () => <FaceIcon style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'users',
        description: 'Usuarios',
        tooltip: 'Usuarios',
        path: paths.USERS,
        mainView: <User />,
        manageView: (baseUrl) => <ManageUser baseUrl={baseUrl} />,
        icon: () => <AccountCircleIcon style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'products',
        description: 'Productos',
        tooltip: 'Productos',
        path: paths.PRODUCTS,
        mainView: <Product />,
        manageView: (baseUrl) => <ManageProduct baseUrl={baseUrl} />,
        icon: () => <ShoppingCart style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'inventory',
        description: 'Inventario',
        tooltip: 'Inventario',
        path: paths.INVENTORY,
        mainView: <User />,
        icon: () => <Inventory style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'domains',
        description: 'Dominios',
        tooltip: 'Dominios',
        path: paths.DOMAINS,
        mainView: <Domain />,
        manageView: (baseUrl) => <ManageDomain baseUrl={baseUrl} />,
        icon: () => <FormatListNumberedRtlSharp style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'purchase_orders',
        description: 'Ordenes de Compra',
        tooltip: 'Ordenes de Compra',
        path: paths.PURCHASE_ORDERS,
        mainView: <User />,
        icon: () => <Assignment style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'sale_orders',
        description: 'Ventas',
        tooltip: 'Ventas',
        path: paths.SALE_ORDERS,
        mainView: <User />,
        icon: () => <Receipt style={{ width: 22, height: 22 }} />,
    },
];

export const subroutes: RouteConfig[] = [];
