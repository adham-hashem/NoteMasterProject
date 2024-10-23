import { Box, Card, CardContent, Chip, Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Note {
    id: string;
    userId: string;
    subjectId: string;
    noteContent: string;
    createdAt: any;
    applicationUser: any;
    subject: any;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

// Notes
function SubjectNotes() {
    const { id } = useParams<{ id: string }>();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [editNoteId, setEditNoteId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [newNoteContent, setNewNoteContent] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        axios
            .get(`http://localhost:5226/api/subjects/${id}/notes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => setNotes(response.data))
            .catch((error) => console.log(error))
            .finally(() => setLoading(false));
    }, [id]);

    // Edit a note
    const handleEdit = (note: Note) => {
        setEditNoteId(note.id);
        setEditContent(note.noteContent);
    };

    const saveEdit = async (noteId: string) => {
        const token = localStorage.getItem("jwtToken");
        try {
            await axios.put(
                `http://localhost:5226/api/subjects/${id}/notes/${noteId}`,
                { noteContent: editContent },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === noteId ? { ...note, noteContent: editContent } : note
                )
            );
            setEditNoteId(null);
            setEditContent("");
        } catch (error) {
            console.log(error);
        }
    };

    // Add a new note
    const addNote = async () => {
        const token = localStorage.getItem("jwtToken");
        try {
            const response = await axios.post(
                `http://localhost:5226/api/subjects/${id}/notes`,
                { noteContent: newNoteContent },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNotes((prevNotes) => [...prevNotes, response.data]);
            setNewNoteContent("");
        } catch (error) {
            console.log(error);
        }
    };

    // Delete a note
    const handleDelete = async (noteId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this note?");
        if (!confirmDelete) return;

        const token = localStorage.getItem("jwtToken");
        try {
            await axios.delete(`http://localhost:5226/api/subjects/${id}/notes/${noteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return <h3>Loading...</h3>;
    }

    return (
        <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <Typography variant="h3" sx={{ mb: "20px", textAlign: "center" }}>
                Notes
            </Typography>

            {/* Add New Note Section */}
            <Box sx={{ textAlign: "center", mt: "20px", mb: "20px" }}>
                <TextField
                    fullWidth
                    label="New Note"
                    variant="outlined"
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    sx={{ mb: "10px" }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={addNote}
                >
                    Add Note
                </Button>
            </Box>

            {/* Notes List */}
            {notes.length > 0 ? (
                notes.map((note, index) => (
                    <Card key={note.id} sx={{ mb: "20px", boxShadow: 3 }}>
                        <CardContent>
                            <Chip
                                label={`Note ${index + 1}`}
                                variant="filled"
                                sx={{ fontSize: "15px", mb: "15px" }}
                                color="primary"
                            />
                            {editNoteId === note.id ? (
                                <>
                                    <TextField
                                        fullWidth
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        sx={{ mb: "10px" }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => saveEdit(note.id)}
                                        sx={{ mr: "10px" }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => setEditNoteId(null)}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Typography 
                                        variant="body1"
                                        sx={{ mt: '15px', mb: '20px' }}
                                    >
                                        {note.noteContent}
                                    </Typography>
                                    <Typography variant="body2">
                                        {note.createdAt ? formatDate(note.createdAt) : "No date available"}
                                    </Typography>
                                    <Button
                                        variant="text"
                                        color="primary"
                                        onClick={() => handleEdit(note)}
                                        sx={{ mt: "10px", mr: "10px" }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="text"
                                        sx={{ color: "#FF0000", mt: "10px" }}
                                        onClick={() => handleDelete(note.id)}
                                    >
                                        Delete
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                    No notes found!
                </Typography>
            )}
        </Box>
    );
}

export default SubjectNotes;
