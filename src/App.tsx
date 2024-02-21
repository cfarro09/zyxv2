// src/App.tsx

import { ThemeProvider, createTheme } from '@mui/material/styles'; // Importa ThemeProvider
import RouterApp from './routes/AppRoutes'; // Ajusta la ruta según la ubicación de tu archivo de rutas
import 'react-date-range/dist/styles.css'; // Importa los estilos CSS
import 'react-date-range/dist/theme/default.css';
import './App.css';

const theme = createTheme({
    direction: 'ltr',
    palette: {
        primary: {
            main: '#239bae',
            dark: '#3057D5',
            light: '#6bc6db',
            contrastText: '#E1E1E1',
        },
        secondary: {
            main: '#bf1760',
            dark: '#870e44',
            light: '#e287a8',
            contrastText: '#ffffff', // O #FFFFFF si prefieres contraste con blanco
        },
        text: {
            primary: '#5b5b5b',
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
