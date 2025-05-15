import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authentication from './pages/Authentication';
import Register from './pages/Register';
import Home from './pages/Home';
import Add from './pages/Add';
import Details from './pages/Details';
import PrivateRoute from './PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/add" element={<PrivateRoute><Add /></PrivateRoute>} />
        <Route path="/details/:id" element={<PrivateRoute><Details /></PrivateRoute>} />


      </Routes>
    </Router>
  );
};

export default App;
