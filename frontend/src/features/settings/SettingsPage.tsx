import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
    const { token } = useAuth(); // Get token from Auth context

    const [userData, setUserData] = useState<any>(null); // Replace `any` with a proper type if you have one
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editField, setEditField] = useState<"name" | "email" | "gender" | "address" | "postalCode" | "phone" | null>(null);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");

    // Fetch user data from API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:5226/api/account/user", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setUserData(data);

                // Set initial state values from fetched data
                setName(data.personName);
                setEmail(data.email);
                setGender(data.gender);
                setAddress(data.address);
                setPostalCode(data.postalCode);
                setPhone(data.phoneNumber);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [token]);

    const handleEditClick = (field: "name" | "email" | "gender" | "address" | "postalCode" | "phone") => {
        setEditField(field);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setPassword(""); // Clear password after closing
    };

    const handleSave = async () => {
        // Logic to save changes to the API
        const updatedData = {
            personName: editField === "name" ? name : userData.personName,
            email: editField === "email" ? email : userData.email,
            gender: editField === "gender" ? gender : userData.gender,
            address: editField === "address" ? address : userData.address,
            postalCode: editField === "postalCode" ? postalCode : userData.postalCode,
            phoneNumber: editField === "phone" ? phone : userData.phoneNumber,
            password,
        };

        try {
            const response = await fetch("http://localhost:5226/api/account/user", {
                method: "PUT", // or PATCH, depending on your API
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });
            if (response.ok) {
                // Update state after successful save
                setUserData(updatedData);
                handleCloseDialog();
            } else {
                // Handle error
                console.error("Error updating user data:", await response.json());
            }
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    };

    const handleChangePasswordClick = () => {
        setPasswordDialogOpen(true);
    };

    const handleClosePasswordDialog = () => {
        setPasswordDialogOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleSavePassword = async () => {
        // Logic to change the password
        if (newPassword !== confirmPassword) {
            console.error("New passwords do not match");
            return;
        }

        const passwordData = {
            currentPassword,
            newPassword,
        };

        try {
            const response = await fetch("http://localhost:5226/api/account/change-password", {
                method: "POST", // or the correct method your API requires
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(passwordData),
            });
            if (response.ok) {
                handleClosePasswordDialog();
            } else {
                console.error("Error changing password:", await response.json());
            }
        } catch (error) {
            console.error("Error changing password:", error);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", padding: "16px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
            <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
                <AccountCircleIcon sx={{ fontSize: 70 }} />
            </Avatar>
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5">
                        Name: {name}
                        <IconButton onClick={() => handleEditClick("name")}>
                            <EditIcon />
                        </IconButton>
                    </Typography>
                    <Typography variant="body1">
                        Email: {email}
                        <IconButton onClick={() => handleEditClick("email")}>
                            <EditIcon />
                        </IconButton>
                    </Typography>
                    <Typography variant="body1">
                        Gender: {gender}
                        <IconButton onClick={() => handleEditClick("gender")}>
                            <EditIcon />
                        </IconButton>
                    </Typography>
                    <Typography variant="body1">
                        Address: {address}
                        <IconButton onClick={() => handleEditClick("address")}>
                            <EditIcon />
                        </IconButton>
                    </Typography>
                    <Typography variant="body1">
                        Postal Code: {postalCode}
                        <IconButton onClick={() => handleEditClick("postalCode")}>
                            <EditIcon />
                        </IconButton>
                    </Typography>
                    <Typography variant="body1">
                        Phone Number: {phone}
                        <IconButton onClick={() => handleEditClick("phone")}>
                            <EditIcon />
                        </IconButton>
                    </Typography>
                </Box>
            </Box>
            <Button onClick={handleChangePasswordClick} variant="contained" sx={{ mt: 2 }}>
                Change Password
            </Button>

            {/* Edit Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>Edit {editField}</DialogTitle>
            <DialogContent sx={{ padding: 2 }}> {/* Add padding to the dialog content */}
                <TextField
                    label={`New ${editField}`}
                    value={editField === "name" ? name : editField === "email" ? email : editField === "gender" ? gender : editField === "address" ? address : editField === "postalCode" ? postalCode : phone}
                    onChange={(e) => {
                        if (editField === "name") setName(e.target.value);
                        if (editField === "email") setEmail(e.target.value);
                        if (editField === "gender") setGender(e.target.value);
                        if (editField === "address") setAddress(e.target.value);
                        if (editField === "postalCode") setPostalCode(e.target.value);
                        if (editField === "phone") setPhone(e.target.value);
                    }}
                    fullWidth
                    sx={{ marginTop: 2, minHeight: "56px" }} // Set a minimum height for the text field
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ marginTop: 2, minHeight: "56px" }} // Set a minimum height for the password field as well
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>


            {/* Change Password Dialog */}
            <Dialog open={passwordDialogOpen} onClose={handleClosePasswordDialog}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Current Password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePasswordDialog}>Cancel</Button>
                    <Button onClick={handleSavePassword} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserProfile;
