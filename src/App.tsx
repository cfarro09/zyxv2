// src/App.tsx

import { ThemeProvider, createTheme } from '@mui/material/styles'; // Importa ThemeProvider
import RouterApp from './routes/AppRoutes'; // Ajusta la ruta según la ubicación de tu archivo de rutas
import './App.css';

const theme = createTheme({
    direction: 'ltr',
    palette: {
        primary: {
            main: '#7367f0',
            dark: '#493dba',
            light: '#aa53e0',
            contrastText: '#fff',
        },
        secondary: {
            main: '#FFFFFF',
            light: '#FFFFFF',
            dark: '#FFFFFF',
            contrastText: '#000',
        },
        text: {
            primary: '#2E2C34',
            secondary: '#B6B4BA',
        },
    },
    typography: {
        fontFamily: 'dm-sans',
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <RouterApp />
        </ThemeProvider>
    );
}

export default App;
