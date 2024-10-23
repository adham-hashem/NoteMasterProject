import { useEffect, useState } from "react";
import { TextField, Button, CircularProgress, Snackbar, Alert, Grid } from "@mui/material";
import SubjectCard from "./SubjectCard";

interface Subject {
  id: string;
  name: string;
}

const Catalog: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [adding, setAdding] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newSubjectName, setNewSubjectName] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editingSubjectName, setEditingSubjectName] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      setIsAuthenticated(true);
      fetchSubjects(token); // Pass the token to fetchSubjects
    } else {
      setIsAuthenticated(false);
      setError("Please log in.");
      setLoading(false);
    }
  }, []);

  const fetchSubjects = async (token: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5226/api/subjects", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch subjects!");
      }

      const data = await response.json();
      setSubjects(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!newSubjectName.trim()) {
      setError("Subject name cannot be empty.");
      return;
    }

    if (token) {
      setAdding(true);
      try {
        const response = await fetch("http://localhost:5226/api/subjects", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newSubjectName }),
        });

        if (!response.ok) {
          throw new Error("Failed to add subject!");
        }

        const newSubject: Subject = await response.json();
        setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
        setNewSubjectName("");
        setShowSuccess("Subject added successfully!");
      } catch (error: any) {
        setError(error.message);
      } finally {
        setAdding(false);
      }
    } else {
      setError("Please log in.");
    }
  };

  const handleEditSubject = (id: string, currentName: string) => {
    setEditingSubjectId(id);
    setEditingSubjectName(currentName);
  };

  const handleUpdateSubject = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!editingSubjectName.trim()) {
      setError("Subject name cannot be empty.");
      return;
    }

    if (token && editingSubjectId) {
      try {
        const response = await fetch(`http://localhost:5226/api/subjects/${editingSubjectId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editingSubjectName }),
        });

        if (!response.ok) {
          throw new Error("Failed to update subject!");
        }

        setSubjects((prevSubjects) =>
          prevSubjects.map((subject) =>
            subject.id === editingSubjectId ? { ...subject, name: editingSubjectName } : subject
          )
        );
        setEditingSubjectId(null);
        setEditingSubjectName("");
        setShowSuccess("Subject updated successfully!");
      } catch (error: any) {
        setError(error.message);
      }
    } else {
      setError("Please log in.");
    }
  };

  const handleDeleteSubject = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this subject?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("Please log in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5226/api/subjects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete subject!");
      }

      setSubjects((prevSubjects) => prevSubjects.filter((subject) => subject.id !== id));
      setShowSuccess("Subject deleted successfully!");
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading subjects...</div>;
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <h1>Subjects</h1>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
            <TextField
              label="Subject Name"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Button variant="contained" color="primary" onClick={handleAddSubject} disabled={adding}>
              {adding ? <CircularProgress size={24} color="inherit" /> : "Add Subject"}
            </Button>
          </div>

          <Grid container spacing={2}>
            {subjects.map((subject) => (
              <Grid item xs={12} sm={6} md={3} key={subject.id}>
                <SubjectCard subject={subject} onEdit={handleEditSubject} onDelete={handleDeleteSubject} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Alert severity="warning">Please log in to view and manage subjects.</Alert>
      )}

      {editingSubjectId && (
        <div style={{ marginTop: '20px' }}>
          <TextField
            label="Edit Subject Name"
            value={editingSubjectName}
            onChange={(e) => setEditingSubjectName(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button variant="contained" color="secondary" onClick={handleUpdateSubject}>
            Update Subject
          </Button>
        </div>
      )}

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={3000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(showSuccess)}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(null)}
      >
        <Alert onClose={() => setShowSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {showSuccess}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Catalog;
