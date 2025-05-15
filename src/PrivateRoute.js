import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated'); // Проверяем вход

    return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
