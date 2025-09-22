// src/pages/UploadPage.js
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  // Get token from Redux
  const token = useSelector((state) => state.auth.token);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ["text/csv", "application/vnd.ms-excel"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage("Invalid file type. Please upload a CSV file.");
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setMessage("File too large. Max size is 5MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a valid CSV file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    if (!token) {
      setMessage("User not authenticated");
      return;
    }

    if (abortControllerRef.current) abortControllerRef.current.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        signal: controller.signal,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Upload successful: ${data.s3Url}`);
        setFile(null);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Upload canceled");
        setMessage("Upload canceled");
      } else {
        console.error("Upload error", err);
        setMessage("Upload failed. Check console for details.");
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
  };

  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={2}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 600,
          textAlign: "center",
          borderRadius: 3,
          border: "2px dashed #ccc",
          bgcolor: "#fafafa",
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 50, color: "primary.main" }} />
        <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
          Upload CSV File
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Drag and drop your CSV file here <br /> or click to browse
        </Typography>

        <input
          type="file"
          accept=".csv"
          id="csv-upload"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <label htmlFor="csv-upload">
          <Button variant="outlined" component="span">
            {file ? file.name : "Choose CSV File"}
          </Button>
        </label>

        <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Upload"
            )}
          </Button>

          {loading && (
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </Box>

        {message && (
          <Typography
            variant="body2"
            sx={{ mt: 3 }}
            color={
              message.startsWith("Upload successful")
                ? "success.main"
                : "error.main"
            }
          >
            {message}
          </Typography>
        )}

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 4, display: "block" }}
        >
          Supported format: CSV with comma-separated values. <br />
          Max size: 5MB. First row should contain column headers.
        </Typography>
      </Paper>
    </Box>
  );
};

export default UploadPage;
