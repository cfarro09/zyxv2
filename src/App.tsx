// src/App.tsx

import React from 'react';
import { ThemeProvider } from '@mui/material/styles'; // Importa ThemeProvider
import { createTheme } from '@mui/material/styles';
import RouterApp from './routes/AppRoutes'; // Ajusta la ruta según la ubicación de tu archivo de rutas
import './App.css';

const theme = createTheme({
  direction: 'ltr',
  palette: {
    primary: {
      main: "#7721AD",
      dark: "#381052",
      light: "#aa53e0",
      contrastText: "#fff",
    },
    secondary: {
      main: "#FFFFFF",
      light: "#FFFFFF",
      dark: "#FFFFFF",
      contrastText: "#000",
    },
    text: {
      primary: "#2E2C34",
      secondary: "#B6B4BA",
    },
  },
  typography: {
    fontFamily: 'dm-sans',
  }
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <RouterApp />
    </ThemeProvider>
  );
}

export default App;
