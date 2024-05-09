import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Typography, TextField, MenuItem, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';

const UserFilesComponent = () => {
  const [userFiles, setUserFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCriteria, setFilterCriteria] = useState('none');

  const { signupDetails } = useUser();

  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        const { email } = signupDetails;
        const response = await axios.post('http://localhost:3001/getFiles', { email });
        setUserFiles(response.data);
        setFilteredFiles(response.data); // Initialize filteredFiles with userFiles
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user files:', error);
        setLoading(false);
      }
    };

    if (signupDetails && signupDetails.email) {
      fetchUserFiles();
    }
  }, [signupDetails]);

  useEffect(() => {
    // Filter files based on searchKeyword
    const filtered = userFiles.filter(file =>
      file.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredFiles(filtered);
  }, [searchKeyword, userFiles]);

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`http://localhost:3001/deleteFile/${fileId}`);
      setUserFiles(prevFiles => prevFiles.filter(file => file._id !== fileId));
      setFilteredFiles(prevFiles => prevFiles.filter(file => file._id !== fileId)); // Update filteredFiles
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleDownloadFile = (file) => {
    const byteCharacters = atob(file.content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: file.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFilterChange = (event) => {
    setFilterCriteria(event.target.value);
    let sortedFiles = [...filteredFiles]; // Sort from filteredFiles, not userFiles
    if (event.target.value === 'nameAsc') {
      sortedFiles.sort((a, b) => a.name.localeCompare(b.name));
    } else if (event.target.value === 'nameDesc') {
      sortedFiles.sort((a, b) => b.name.localeCompare(a.name));
    } else if (event.target.value === 'sizeAsc') {
      sortedFiles.sort((a, b) => a.size - b.size);
    } else if (event.target.value === 'sizeDesc') {
      sortedFiles.sort((a, b) => b.size - a.size);
    }
    setFilteredFiles(sortedFiles);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <h1>User Files</h1>
      <Box mb={2}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <TextField
          select
          label="Filter"
          variant="outlined"
          value={filterCriteria}
          onChange={handleFilterChange}
          style={{ marginLeft: 10 }}
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="nameAsc">Name (Ascending)</MenuItem>
          <MenuItem value="nameDesc">Name (Descending)</MenuItem>
          <MenuItem value="sizeAsc">Size (Ascending)</MenuItem>
          <MenuItem value="sizeDesc">Size (Descending)</MenuItem>
        </TextField>
      </Box>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Size (KB)</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFiles.map(file => (
              <TableRow key={file._id}>
                <TableCell>{file.name}</TableCell>
                <TableCell>{file.date}</TableCell>
                <TableCell>{file.type}</TableCell>
                <TableCell>{(file.content.length / 1024).toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteFile(file._id)} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDownloadFile(file)} aria-label="download">
                    <GetAppIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserFilesComponent;
