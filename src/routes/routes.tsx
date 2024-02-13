import React from 'react';
import { RouteConfig } from "@types";
import paths from "common/constants/paths";
import { Dashboard, Person, ShoppingCart, Inventory, FormatListNumberedRtlSharp, Receipt, Assignment } from '@mui/icons-material';

export const routes: RouteConfig[] = [
    {
        key: "dashboard",
        description: "dashboard",
        tooltip: "dashboard",
        path: paths.DASHBOARD,
        icon: (className) => <Dashboard style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: "clients",
        description: "clients",
        tooltip: "clients",
        path: paths.CLIENTS,
        icon: (className) => <Person style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: "products",
        description: "products",
        tooltip: "products",
        path: paths.PRODUCTS,
        icon: (className) => <ShoppingCart style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: "inventory",
        description: "inventory",
        tooltip: "inventory",
        path: paths.INVENTORY,
        icon: (className) => <Inventory style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: "domains",
        description: "domains",
        tooltip: "domains",
        path: paths.DOMAINS,
        icon: (className) => <FormatListNumberedRtlSharp style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: "purchase_orders",
        description: "purchase_orders",
        tooltip: "purchase_orders",
        path: paths.PURCHASE_ORDERS,
        icon: (className) => <Assignment style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: "sale_orders",
        description: "sale_orders",
        tooltip: "sale_orders",
        path: paths.SALE_ORDERS,
        icon: (className) => <Receipt style={{ width: 22, height: 22 }} className={className} />,
    },
];

export const subroutes: RouteConfig[] = [
];