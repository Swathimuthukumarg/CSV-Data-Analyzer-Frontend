// src/pages/ChartsPage.js
import React, { useEffect, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#d62728",
  "#9467bd",
];

const ChartsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      // Abort previous request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const signal = controller.signal;

      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/data`, {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        });

        const data = await res.json();

        if (res.ok) {
          // Flatten like DataTablePage
          const parsedRows =
            data.data?.map((row) => ({
              id: row.id,
              ...row.data,
            })) || [];
          setRows(parsedRows);
        } else {
          setError(data.message || "Failed to fetch data");
        }
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch canceled");
        } else {
          console.error("Fetch error", err);
          setError("Failed to fetch data");
        }
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    };

    fetchData();

    // Cleanup: abort fetch if component unmounts
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  if (loading)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}> Loading charts...</Typography>
      </Box>
    );

  if (error)
    return (
      <Typography color="error" sx={{ p: 4 }}>
        {error}
      </Typography>
    );

  if (!rows.length)
    return (
      <Typography sx={{ p: 4 }}>
        No records available for chart visualization. Upload a CSV first.
      </Typography>
    );

  // Map data correctly: access fields directly
  const barData = rows.map((row) => ({
    category: row.category || "Unknown",
    amount: Number(row.amount || 0),
  }));

  // Aggregate data for Pie Chart
  const pieData = Object.values(
    barData.reduce((acc, { category, amount }) => {
      acc[category] = acc[category] || { category, value: 0 };
      acc[category].value += amount;
      return acc;
    }, {})
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Data Visualization
      </Typography>

      {/* Bar Chart */}
      <Paper sx={{ p: 3, mb: 5 }}>
        <Typography variant="h6" gutterBottom>
          Bar Chart: Amount per Category
        </Typography>
        <Box sx={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Pie Chart */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Pie Chart: Distribution by Category
        </Typography>
        <Box sx={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChartsPage;
