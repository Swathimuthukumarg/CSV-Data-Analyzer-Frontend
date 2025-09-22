// src/pages/DataTablePage.js
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";

const DataTablePage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [sortModel, setSortModel] = useState([
    { field: "createdAt", sort: "desc" },
  ]);

  const token = useSelector((state) => state.auth.token);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      if (abortControllerRef.current) abortControllerRef.current.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const signal = controller.signal;

      setLoading(true);
      setError("");

      try {
        const sortField = sortModel[0]?.field || "createdAt";
        const sortOrder = sortModel[0]?.sort?.toUpperCase() || "DESC";

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/data?page=${
            page + 1
          }&limit=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal,
          }
        );

        const data = await res.json();

        if (res.ok) {
          const parsedRows =
            data.data?.map((row, i) => ({
              id: row.id || `${page}-${i}`,
              ...row.data,
            })) || [];
          setRows(parsedRows);
          setRowCount(data.total || 0);
        } else {
          setError(data.message || "Failed to fetch data");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error", err);
          setError("Failed to fetch data");
        }
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    };

    fetchData();
  }, [token, page, pageSize, sortModel]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  if (!rows.length)
    return (
      <Box p={3}>
        <Alert severity="info">No records found. Upload a CSV first!</Alert>
      </Box>
    );

  const columns = Object.keys(rows[0]).map((key) => ({
    field: key,
    headerName: key.toUpperCase(),
    flex: 1,
    sortable: true,
  }));

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Your Uploaded Data
      </Typography>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={rowCount}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newSize) => setPageSize(newSize)}
          onSortModelChange={(newModel) => setSortModel(newModel)}
          sortModel={sortModel}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      </div>
    </Box>
  );
};

export default DataTablePage;
