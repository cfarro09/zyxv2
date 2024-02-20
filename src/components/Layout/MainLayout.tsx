import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
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
import { useNavigate } from 'react-router-dom';

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
			<Box sx={{ display: 'flex', height: '100vh', width: '99vw' }}>
				<CssBaseline />
				<AppBar position="fixed" open={open}>
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
						<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
							Queen Store
						</Typography>
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
				<Box component="main" sx={{ flexGrow: 1, p: 1, display: 'flex', flexDirection: 'column' }}>
					<DrawerHeader />
					<div style={{ width: '100%', flex: 1 }}>
						{children}
					</div>
				</Box>
			</Box>
			<Popus />
		</React.Fragment>
	);
}

export default MainLayout;