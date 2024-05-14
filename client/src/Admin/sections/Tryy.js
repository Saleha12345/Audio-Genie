import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import BlockIcon from '@mui/icons-material/Block';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import { green, yellow , red} from '@mui/material/colors';

const Tryy = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (email) => {
    try {
      const response = await axios.delete(`http://localhost:3001/users/${email}`);
      if (response.status === 200) {
        setUsers(users.filter(user => user.email !== email));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  const toggleUserStatus = async (email, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      const response = await axios.put(`http://localhost:3001/users/${email}/status/${newStatus}`);
      if (response.status === 200) {
        // Update the user status in the state
        setUsers(users.map(user => user.email === email ? { ...user, status: newStatus } : user));
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><b>Avatar</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell align="right"><b>Email</b></TableCell>
              <TableCell align="right"><b>Subscription Plan</b></TableCell>
              <TableCell align="right"><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Avatar>{user.username.charAt(0)}</Avatar>
                </TableCell>
                <TableCell component="th" scope="row">
                  {user.username}
                </TableCell>
                <TableCell align="right">{user.email}</TableCell>
                <TableCell align="right">{user.plan}</TableCell>
                <TableCell align="right">
                  <Box display="flex">
                  <IconButton onClick={() => deleteUser(user.email)}><DeleteIcon sx={{ color: red[500], marginRight:'-60px' }} /></IconButton>
                    <IconButton onClick={() => toggleUserStatus(user.email, user.status)}>
                      <BlockIcon sx={{ color: user.status === 'active' ? yellow[500] : green[500] , marginRight:'7px'}} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Tryy;
