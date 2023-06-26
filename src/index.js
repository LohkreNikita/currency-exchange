import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const Theme = createTheme({
  palette: {
    primary: {
      main: '#009688',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <ThemeProvider theme={Theme}>
        <App/>
    </ThemeProvider>
  </React.StrictMode>
);


