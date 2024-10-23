import React, { useState } from "react";
import { TextField, Button, Snackbar, Alert, Box, Typography, MenuItem } from "@mui/material";

const Register: React.FC = () => {
  const [personName, setPersonName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>("male"); // Default gender
  const [address, setAddress] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!personName || !email || !address || !postalCode || !phoneNumber || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const userData = {
      PersonName: personName,
      Email: email,
      Gender: gender,
      Address: address,
      PostalCode: postalCode,
      PhoneNumber: phoneNumber,
      Password: password,
      ConfirmPassword: confirmPassword,
    };

    try {
      const response = await fetch("http://localhost:5226/api/account/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Registration failed! Please try again.");
      }

      setSuccess(true);
      // Clear form fields after successful registration
      setPersonName("");
      setEmail("");
      setGender("male"); // Reset to default gender
      setAddress("");
      setPostalCode("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleRegister}
      sx={{
        maxWidth: 400,
        margin: "auto",
        padding: 4,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        gap: 2, // Adjust gap for spacing
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Register
      </Typography>
      <TextField
        label="Person Name"
        value={personName}
        onChange={(e) => setPersonName(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Gender"
        select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        fullWidth
        margin="normal"
        required
      >
        <MenuItem value="male">Male</MenuItem>
        <MenuItem value="female">Female</MenuItem>
        <MenuItem value="other">Other</MenuItem>
      </TextField>
      <TextField
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Postal Code"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Register
      </Button>

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={3000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: "100%" }}>
          Registration successful!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
