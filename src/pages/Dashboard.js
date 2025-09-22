// src/pages/Dashboard.js
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      {/* Top Navigation */}
      <Navbar />

      {/* Nested Routes */}
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
