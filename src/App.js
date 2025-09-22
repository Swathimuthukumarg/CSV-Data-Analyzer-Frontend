// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import DataTablePage from "./pages/DataTablePage";
import ChartsPage from "./pages/ChartsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard layout with nested routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="upload" element={<UploadPage />} />
          <Route path="data-table" element={<DataTablePage />} />
          <Route path="charts" element={<ChartsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
