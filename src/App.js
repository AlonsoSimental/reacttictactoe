import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Dashboard from './components/Dashboard';  
import Board from './components/Board';
import ProtectedRoute from './auth/ProtectedRoute';  

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/board/:boardId" 
          element={
            <ProtectedRoute>
              <Board />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
