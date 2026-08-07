import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppProviders from './providers';
import AppRoutes from './routes';
import '../assets/styles/globals.css';

export const App = () => {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
};

export default App;
