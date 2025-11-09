import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  ShowChart as ShowChartIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    contactNo: '',
    role: '',
  });

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const usersData = await response.json();
      setUsers(usersData);

      const totalUsers = usersData.length;
      const adminUsers = usersData.filter(u => u.role === 'ROLE_ADMIN' || u.role === 'ADMIN').length;
      const activeUsers = usersData.filter(u => u.active !== false).length;

      setStats({
        totalUsers,
        adminUsers,
        activeUsers,
      });

    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      contactNo: user.contactNo || '',
      role: user.role || 'ROLE_USER',
    });
    setEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      
      setUsers(users.map(u => u.id === selectedUser.id ? updatedUser : u));
      setEditDialogOpen(false);
      setSelectedUser(null);
      
      fetchAllUsers();
      
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(u => u.id !== userId));
      fetchAllUsers();

    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message || 'Failed to delete user');
    }
  };

  const getRoleColor = (role) => {
    return (role === 'ROLE_ADMIN' || role === 'ADMIN') ? 'error' : 'primary';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a192f 0%, #001e3c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: '#42a5f5' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a192f 0%, #001e3c 100%)',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                mr: 2,
                boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
              }}
            >
              <ShowChartIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #42a5f5 0%, #90caf9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Admin Dashboard
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Manage users and system settings
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchAllUsers}
              variant="outlined"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                borderColor: 'rgba(255,255,255,0.3)',
              }}
            >
              Refresh
            </Button>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              }}
            >
              User Dashboard
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ color: '#42a5f5', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    Total Users
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#42a5f5', fontWeight: 'bold' }}>
                  {stats.totalUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ color: '#4caf50', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    Active Users
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  {stats.activeUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ color: '#ff9800', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    Admin Users
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                  {stats.adminUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper
          elevation={6}
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
              User Management
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {users.length} user(s) found
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>User</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Contact</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Joined</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((userItem) => (
                  <TableRow key={userItem.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                    <TableCell>
                      <Box>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>
                          {userItem.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          @{userItem.username}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          {userItem.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {userItem.contactNo || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={userItem.role}
                        color={getRoleColor(userItem.role)}
                        size="small"
                        sx={{ color: 'white', fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {formatDate(userItem.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => handleEditUser(userItem)}
                          sx={{
                            color: '#42a5f5',
                            '&:hover': { backgroundColor: 'rgba(66, 165, 245, 0.1)' }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteUser(userItem.id)}
                          sx={{
                            color: '#f44336',
                            '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                          }}
                          disabled={userItem.id === user.id}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {users.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                No users found
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #0a192f 0%, #001e3c 100%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          Edit User
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Full Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            margin="normal"
            sx={fieldStyle}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            margin="normal"
            sx={fieldStyle}
          />
          <TextField
            fullWidth
            label="Contact Number"
            value={editForm.contactNo}
            onChange={(e) => setEditForm({ ...editForm, contactNo: e.target.value })}
            margin="normal"
            sx={fieldStyle}
          />
          <TextField
            fullWidth
            label="Role"
            value={editForm.role}
            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            margin="normal"
            select
            sx={fieldStyle}
          >
            <MenuItem value="ROLE_USER">User</MenuItem>
            <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            sx={{
              color: 'rgba(255,255,255,0.8)',
              borderColor: 'rgba(255,255,255,0.3)',
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            }}
          >
            Update User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

const fieldStyle = {
  mb: 2,
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    input: { color: '#fff' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255,255,255,0.3)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255,255,255,0.5)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#42a5f5',
  },
};