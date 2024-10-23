import Grid from '@mui/material/Grid';
import SubjectCard from './SubjectCard';
import { useState } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';

// interface Subject {
//   id: string;
//   name: string;
// }

// interface Props {
//   subjects: Subject[];
// }

const SubjectList = () => {
  // const [subjectList, setSubjectList] = useState(subjects);

  // const handleEdit = (id: string, newName: string) => {
  //   setSubjectList((prevList) =>
  //     prevList.map((subject) =>
  //       subject.id === id ? { ...subject, name: newName } : subject
  //     )
  //   );
  // };

  // const handleDelete = async (id: string) => {
  //   const confirmDelete = window.confirm("Are you sure you want to delete this subject?");
  //   if (!confirmDelete) return;

  //   const token = localStorage.getItem("jwtToken");
  //   try {
  //     await axios.delete(`http://localhost:5226/api/subjects/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     // Update the subject list after successful deletion
  //     setSubjectList((prevList) => prevList.filter((subject) => subject.id !== id));
  //   } catch (error) {
  //     console.error(error);
  //   }
  };

//   return (
//     // <Grid container spacing={2} sx={{ flexGrow: 1 }}>
//     //   {subjectList.map((subject) => (
//     //     <Grid item xs={12} sm={6} md={3} key={subject.id}>
//     //       <SubjectCard subject={subject} onEdit={handleEdit} onDelete={handleDelete} />
//     //     </Grid>
//     //   ))}
//     // </Grid>
//   );
// // };

export default SubjectList;
