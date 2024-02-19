// src/App.tsx

import { ThemeProvider, createTheme } from '@mui/material/styles'; // Importa ThemeProvider
import RouterApp from './routes/AppRoutes'; // Ajusta la ruta según la ubicación de tu archivo de rutas
import './App.css';

const theme = createTheme({
    direction: 'ltr',
    palette: {
        primary: {
            main: '#5376FF',
            dark: '#3057D5',
            light: '#7A9BFF',
            contrastText: '#E1E1E1',
        },
        secondary: {
            main: '#03DAC5',
            dark: '#018786',
            light: '#70EFDE',
            contrastText: '#E1E1E1', // O #FFFFFF si prefieres contraste con blanco
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
