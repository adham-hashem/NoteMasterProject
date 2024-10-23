import { useState } from "react";
import { Box, Button, TextField, Typography, Snackbar, Alert } from "@mui/material";

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleForgotPassword = async () => {
        try {
            const response = await fetch('http://localhost:5226/api/account/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setShowSuccess(true);
                setEmail('');
            } else {
                setErrorMessage('Failed to request password reset');
                setShowError(true);
            }
        } catch (error) {
            console.error('An error occurred during password reset:', error);
            setErrorMessage('An error occurred during password reset');
            setShowError(true);
        }
    };

    return (
        <Box
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
                Forgot Password
            </Typography>
            <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                required
            />
            <Button
                onClick={handleForgotPassword}
                fullWidth
                variant="contained"
                color="primary"
                sx={{ padding: 1.5 }}
            >
                Send Reset Link
            </Button>

            {/* Snackbar for success or error messages */}
            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
            >
                <Alert severity="success" onClose={() => setShowSuccess(false)}>
                    Password reset request sent successfully!
                </Alert>
            </Snackbar>
            <Snackbar
                open={showError}
                autoHideDuration={3000}
                onClose={() => setShowError(false)}
            >
                <Alert severity="error" onClose={() => setShowError(false)}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ForgotPasswordPage;
