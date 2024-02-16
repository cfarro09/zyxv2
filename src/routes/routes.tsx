import { RouteConfig } from "@types";
import paths from "common/constants/paths";
import { Dashboard, Person, ShoppingCart, Inventory, FormatListNumberedRtlSharp, Receipt, Assignment } from '@mui/icons-material';

export const routes: RouteConfig[] = [
    {
        key: "dashboard",
        description: "dashboard",
        tooltip: "dashboard",
        path: paths.DASHBOARD,
        icon: () => <Dashboard style={{ width: 22, height: 22 }}  />,
    },
    {
        key: "clients",
        description: "clients",
        tooltip: "clients",
        path: paths.CLIENTS,
        icon: () => <Person style={{ width: 22, height: 22 }}  />,
    },
    {
        key: "products",
        description: "products",
        tooltip: "products",
        path: paths.PRODUCTS,
        icon: () => <ShoppingCart style={{ width: 22, height: 22 }}  />,
    },
    {
        key: "inventory",
        description: "inventory",
        tooltip: "inventory",
        path: paths.INVENTORY,
        icon: () => <Inventory style={{ width: 22, height: 22 }}  />,
    },
    {
        key: "domains",
        description: "domains",
        tooltip: "domains",
        path: paths.DOMAINS,
        icon: () => <FormatListNumberedRtlSharp style={{ width: 22, height: 22 }}  />,
    },
    {
        key: "purchase_orders",
        description: "purchase_orders",
        tooltip: "purchase_orders",
        path: paths.PURCHASE_ORDERS,
        icon: () => <Assignment style={{ width: 22, height: 22 }}  />,
    },
    {
        key: "sale_orders",
        description: "sale_orders",
        tooltip: "sale_orders",
        path: paths.SALE_ORDERS,
        icon: () => <Receipt style={{ width: 22, height: 22 }}  />,
    },
];

export const subroutes: RouteConfig[] = [
];