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

export const routes: RouteConfig[] = [
    {
        key: 'dashboard',
        description: 'dashboard',
        tooltip: 'dashboard',
        path: paths.DASHBOARD,
        mainView: <User />,
        icon: () => <Dashboard style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'clients',
        description: 'clients',
        tooltip: 'clients',
        path: paths.CLIENTS,
        mainView: <User />,
        icon: () => <Person style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'users',
        description: 'users',
        tooltip: 'users',
        path: paths.USERS,
        mainView: <User />,
        manageView: <ManageUser />,
        icon: () => <Person style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'products',
        description: 'products',
        tooltip: 'products',
        path: paths.PRODUCTS,
        mainView: <Product />,
        manageView: <ManageProduct />,
        icon: () => <ShoppingCart style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'inventory',
        description: 'inventory',
        tooltip: 'inventory',
        path: paths.INVENTORY,
        mainView: <User />,
        icon: () => <Inventory style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'domains',
        description: 'domains',
        tooltip: 'domains',
        path: paths.DOMAINS,
        mainView: <Domain />,
        manageView: <ManageDomain />,
        icon: () => <FormatListNumberedRtlSharp style={{ width: 22, height: 22 }}  />,
    },
    {
        key: 'purchase_orders',
        description: 'purchase_orders',
        tooltip: 'purchase_orders',
        path: paths.PURCHASE_ORDERS,
        mainView: <User />,
        icon: () => <Assignment style={{ width: 22, height: 22 }} />,
    },
    {
        key: 'sale_orders',
        description: 'sale_orders',
        tooltip: 'sale_orders',
        path: paths.SALE_ORDERS,
        mainView: <User />,
        icon: () => <Receipt style={{ width: 22, height: 22 }} />,
    },
];

export const subroutes: RouteConfig[] = [];
