// src/components/Login.js
import React, { useEffect } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();

  const handleLogin = () => {
    const width = 500,
      height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    window.open(
      `${process.env.REACT_APP_API_URL}/auth/google`,
      "GoogleLogin",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  useEffect(() => {
    const listener = (event) => {
      if (event.data?.type === "oauth") {
        const { user, token } = event.data;

        //  Update Redux state
        dispatch(login({ user, token }));

        //  Also store in localStorage for persistence
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect to dashboard/upload
        window.location.href = "/dashboard/upload";
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [dispatch]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f6fa"
    >
      <Card sx={{ width: 400, p: 3, boxShadow: 4, borderRadius: 3 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            CSV Data Analyzer
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Sign in to upload and visualize your CSV data
          </Typography>

          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleLogin}
            sx={{
              mt: 3,
              bgcolor: "#4d1d95ff",
              "&:hover": { bgcolor: "#370570ff" },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              px: 2,
              py: 1,
            }}
            fullWidth
          >
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
