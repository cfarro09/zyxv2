import { RouteConfig } from '@types';
import paths from 'common/constants/paths';
import {
    Dashboard,
    FormatListNumberedRtlSharp,
    Inventory2,
} from '@mui/icons-material';
import { User, ManageUser } from 'pages/User/Index';
import { Product, ManageProduct } from 'pages/Product/Index';
import { Domain, ManageDomain } from "pages/Domain/Index";
import { Customer, ManageCustomer } from 'pages/Customer/Index';
import Account from 'pages/Account/components/Account';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FaceIcon from '@mui/icons-material/Face';
import { ManagePurchase, Purchase } from 'pages/Purchases/Index';
import { Inventory, Kardex } from 'pages/Inventory';
import { ManageSale, Sale } from 'pages/Sales/Index';
import { ManageReport, Reports } from 'pages/CashRegister/Index';
import { CajaIcon, ProductIcon, PurchaseIcon, SaleIcon } from 'assets/icons';
import { CloseOut, DetailCloseOut } from 'pages/Closeout/Index';

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
        key: 'reports',
        description: 'Caja',
        tooltip: 'Caja',
        path: paths.REPORTS,
        mainView: <Reports />,
        manageView: (baseUrl) => <ManageReport baseUrl={baseUrl} />,
        icon: () => <CajaIcon style={{ width: 22, height: 22 }} />,
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
        icon: () => <ProductIcon style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'inventory',
        description: 'Inventario',
        tooltip: 'Inventario',
        path: paths.INVENTORY,
        mainView: <Inventory />,
        manageView: (baseUrl) => <Kardex baseUrl={baseUrl} />,
        icon: () => <Inventory2 style={{ width: 22, height: 22 }} />,
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
        description: 'Compras',
        tooltip: 'Compras',
        path: paths.PURCHASE_ORDERS,
        mainView: <Purchase />,
        manageView: (baseUrl) => <ManagePurchase baseUrl={baseUrl} />,
        icon: () => <PurchaseIcon style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'sale_orders',
        description: 'Ventas',
        tooltip: 'Ventas',
        path: paths.SALE_ORDERS,
        mainView: <Sale />,
        manageView: (baseUrl) => <ManageSale baseUrl={baseUrl} />,
        icon: () => <SaleIcon style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'closeout',
        description: 'Cierre de caja',
        tooltip: 'Ventas',
        path: paths.CLOSEOUT,
        mainView: <CloseOut />,
        manageView: (baseUrl) => <DetailCloseOut baseUrl={baseUrl} />,
        icon: () => <CajaIcon style={{ width: 22, height: 22 }} />,
    },
];

export const subroutes: RouteConfig[] = [];
