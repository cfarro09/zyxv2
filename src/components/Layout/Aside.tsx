import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import type { Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import { Divider, IconButton } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate, useLocation } from 'react-router-dom';
import { routes } from 'routes/routes';
import { RouteConfig } from '@types';
import { useSelector } from 'hooks';
import { cleanPath } from 'common/helpers';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer)(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const ElementMenu: React.FC<{ route: RouteConfig; open: boolean }> = ({ route, open }) => {
    const navigate = useNavigate();
    const location = useLocation(); // Obtener la ubicación actual
    const isActive = cleanPath(location.pathname) === route.path;

    return (
        <ListItem
            key={`${route.path}`}
            disablePadding
            sx={{ display: 'block', backgroundColor: isActive ? 'rgba(0, 0, 0, 0.04)' : 'inherit' }} // Aplicar color de fondo si está activo
            onClick={() => navigate(route.path)}
            component="a"
        >
            <ListItemButton
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    color: isActive ? 'secondary.main' : undefined, // Cambiar el color del texto si está activo
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: 'inherit'
                    }}
                >
                    {route.icon()}
                </ListItemIcon>
                <ListItemText primary={route.description} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
        </ListItem>
    )
}

const Aside: React.FC<{ open: boolean; handleDrawerClose: () => void }> = ({ open, handleDrawerClose }) => {
    const theme = useTheme();
    const applications = useSelector(state => state.login?.validateToken?.user?.menu);

    return (
        <Drawer variant="permanent" open={open}>
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {routes.filter(x => applications[x.path]?.[0]).map((route) => (
                    <ElementMenu
                        key={route.path}
                        route={route}
                        open={open}
                    />
                ))}
            </List>
            <Divider />
        </Drawer>
    );
}

export default Aside;