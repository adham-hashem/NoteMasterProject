import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const { setToken } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const loginData = { Email, Password };

        try {
            const response = await fetch('http://localhost:5226/api/account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const data = await response.json();
                setToken(data.result.token);
                navigate('/subjects');
            } else {
                console.log('Login failed');
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
                maxWidth: 400,
                margin: 'auto',
                padding: 4,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: 3
            }}
        >
            <Typography variant="h4" gutterBottom align="center">
                Login to Your Account
            </Typography>
            <TextField
                label="Email"
                type="email"
                fullWidth
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                required
            />
            <TextField
                label="Password"
                type="password"
                fullWidth
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                required
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ padding: 1.5 }}
            >
                Login
            </Button>
            <Button
                fullWidth
                variant="text"
                color="secondary"
                onClick={() => navigate('/forgot-password')}
            >
                Forgot Password?
            </Button>
        </Box>
    );
}

export default LoginPage;
