import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { AuthProvider } from '../../features/context/AuthContext';
import Login from '../../features/login/LoginPage';
import SubjectList from '../../features/catalog/SubjectList';
import AppProviderBasic from '../../features/home/HomePage';
import Header from './Header';
import { Container, CssBaseline } from '@mui/material';
import Catalog from '../../features/catalog/Catalog';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CssBaseline />
      <Header />
      <Container>
        <Outlet />
      </Container>
    </AuthProvider>
  );
};

export default App;
