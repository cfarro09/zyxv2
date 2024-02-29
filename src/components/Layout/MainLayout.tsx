import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Aside from './Aside';
import Popus from './Popus';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { removeAuthorizationToken } from 'common/helpers';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const BoxMain = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'open',
})<BoxProps>(({ open }) => ({
	flexGrow: 1,
	display: 'flex',
	overflow: "overlay",
	flexDirection: 'column',
	width: `calc(100% - ${open ? drawerWidth : 56}px)`,
}));

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	const [open, setOpen] = React.useState(false);
	const navigate = useNavigate();
	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<React.Fragment>
			<Box sx={{ display: 'flex', minHeight: '100vh' }}>
				<CssBaseline />
				<AppBar position="fixed" color='secondary' open={open}>
					<Toolbar>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={handleDrawerOpen}
							edge="start"
							sx={{
								marginRight: 5,
								...(open && { display: 'none' }),
							}}
						>
							<MenuIcon />
						</IconButton>
						<Box sx={{ flexGrow: 1 }}>
							<Link to={'/'}>
								<img src="./horizontal-logo-white.png" width={110} alt="" />
							</Link>
						</Box>
						<IconButton
							color="inherit"
							aria-label="logout"
							onClick={() => {
								removeAuthorizationToken();
								navigate("/login")
							}}
						>
							<ExitToAppIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				<Aside
					open={open}
					handleDrawerClose={handleDrawerClose}
				/>
				<BoxMain component="main" open={open} p={2}>
					<DrawerHeader />
					<div style={{ width: '100%', flex: 1 }}>
						{children}
					</div>
				</BoxMain>
			</Box>
			<Popus />
		</React.Fragment>
	);
}

export default MainLayout;