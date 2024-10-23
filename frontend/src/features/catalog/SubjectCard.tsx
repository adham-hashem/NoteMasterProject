import { Card, CardMedia, CardContent, Typography, IconButton, CardHeader, Avatar, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import SubjectIcon from '@mui/icons-material/Subject';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Subject {
    id: string;
    name: string;
}

interface Props {
    subject: Subject;
    onDelete: (id: string) => void;
    onEdit: (id: string, newName: string) => void;
}

function SubjectCard({ subject, onDelete, onEdit }: Props) {
    const navigate = useNavigate();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [newName, setNewName] = useState(subject.name);

    const handleCardClick = () => {
        navigate(`/subjects/${subject.id}/notes`);
    };

    const handleEditClick = () => {
        setEditDialogOpen(true);
    };

    const handleDeleteClick = () => {
        if (window.confirm("Are you sure you want to delete this subject?")) {
            onDelete(subject.id);
        }
    };

    const handleEditSubmit = () => {
        onEdit(subject.id, newName);
        setEditDialogOpen(false);
    };

    return (
        <>
            <Card
                sx={{
                    maxWidth: 345,
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {subject.name.charAt(0).toUpperCase()}
                        </Avatar>
                    }
                    title={`${subject.name} Subject`}
                    titleTypographyProps={{
                        sx: { fontWeight: 'bold', color: 'primary.main' },
                    }}
                    action={
                        <>
                            <IconButton onClick={handleEditClick}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={handleDeleteClick}>
                                <DeleteIcon />
                            </IconButton>
                        </>
                    }
                />
                <CardContent
                    sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            backgroundColor: '#AFD3F7',
                        },
                        height: 90
                    }}
                    onClick={handleCardClick}
                >
                    <Typography gutterBottom variant="h5" component="div">
                        <IconButton>
                            <SubjectIcon />
                        </IconButton>
                        {subject.name}
                    </Typography>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Subject</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Subject Name"
                        type="text"
                        fullWidth
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default SubjectCard;
