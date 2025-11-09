import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Tab,
  Tabs,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage({ onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [role, setRole] = useState('ROLE_USER');
  const [loginRole, setLoginRole] = useState('ROLE_USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [allUsersData, setAllUsersData] = useState([]);
  const [registeredUser, setRegisteredUser] = useState(null);

  const API_BASE_URL = 'http://localhost:8080/api/auth';

  const handleApiError = async (response, defaultMessage) => {
    try {
      const errorText = await response.text();
      console.error('🔴 API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        body: errorText,
      });

      let errorMessage = defaultMessage;

      try {
        const errorData = JSON.parse(errorText);
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.errors) {
          if (Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.map((err) => err.defaultMessage || err.message).join(', ');
          } else {
            errorMessage = Object.values(errorData.errors).join(', ');
          }
        } else if (errorData.details) {
          errorMessage = errorData.details;
        }
      } catch (e) {
        if (errorText && errorText.trim() !== '') {
          errorMessage = errorText;
        }
      }

      if (response.status === 400) errorMessage = `Bad Request: ${errorMessage}`;
      else if (response.status === 401) errorMessage = `Unauthorized: ${errorMessage}`;
      else if (response.status === 403) errorMessage = `Forbidden: ${errorMessage}`;
      else if (response.status === 409) errorMessage = `Conflict: ${errorMessage}`;

      return errorMessage;
    } catch (err) {
      console.error('Error handling API error:', err);
      return defaultMessage;
    }
  };

  const fetchAllUsers = async (token) => {
    try {
      console.log('📤 Fetching all users data...');
      
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('📥 Users API response:', {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to fetch users data');
        throw new Error(errorMessage);
      }

      const usersData = await response.json();
      console.log('✅ Users data fetched successfully:', usersData);
      
      return usersData;
    } catch (err) {
      console.error('❌ Error fetching users data:', err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    if (tab === 1) {
      if (!fullName || !username || !email || !password) {
        setError('All fields except contact number are required for registration');
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }
    }

    try {
      let requestData;
      let endpoint;

      if (tab === 0) {
        requestData = { 
          email: email.trim(), 
          password,
          role: loginRole
        };
        endpoint = 'login';
      } else {
        requestData = {
          name: fullName.trim(),
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
          contactNo: contactNo ? contactNo.trim() : null,
          role: role,
        };
        endpoint = 'register';
      }

      console.log('📤 Sending request:', { endpoint, requestData });

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      console.log('📥 Received response:', {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorMessage = await handleApiError(response, tab === 0 ? 'Login failed' : 'Registration failed');
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Success response:', data);

      if (data.token && data.user) {
        // Store user and token in context
        login(data.user, data.token);
        console.log('✅ Auth success, user stored in context:', data.user);
        
        // Determine if user is admin - check both possible role formats
        const userRole = data.user.role;
        console.log('🔍 User role from API:', userRole);
        
        const isAdmin = userRole === 'ROLE_ADMIN' || userRole === 'ADMIN';
        console.log('🔍 Is admin?', isAdmin);

        if (tab === 0) {
          // Login flow - navigate immediately
          console.log('🔄 Processing login navigation...');
          setTimeout(() => {
            if (isAdmin) {
              console.log('🔄 Navigating to Admin Dashboard');
              navigate('/admin-dashboard', { replace: true });
            } else {
              console.log('🔄 Navigating to User Dashboard');
              navigate('/dashboard', { replace: true });
            }
          }, 100);
        } else {
          // Registration flow - show success dialog
          console.log('📝 Registration successful, showing success dialog');
          
          // Store the registered user data with proper isAdmin flag
          setRegisteredUser({
            user: data.user,
            token: data.token,
            isAdmin: isAdmin
          });
          
          if (isAdmin) {
            try {
              console.log('🔄 Admin registered, fetching all users data...');
              const usersData = await fetchAllUsers(data.token);
              setAllUsersData(usersData);
              console.log('✅ All users data stored:', usersData);
            } catch (fetchError) {
              console.warn('⚠️ Could not fetch users data, but registration was successful:', fetchError.message);
            }
          }
          
          setSuccessDialogOpen(true);
          resetForm();
        }
      }

      if (onClose) onClose();
    } catch (err) {
      console.error('❌ Auth error:', err);
      setError(err.message || `Something went wrong during ${tab === 0 ? 'login' : 'registration'}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setUsername('');
    setContactNo('');
    setRole('ROLE_USER');
    setLoginRole('ROLE_USER');
    setError('');
  };

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    resetForm();
  };

  const handleBackToHome = () => {
    if (onClose) onClose();
    else navigate('/');
  };

  const handleCloseButton = () => {
    if (onClose) onClose();
    else navigate('/');
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    setTab(0);
    setRegisteredUser(null);
  };

  const handleGoToDashboard = () => {
    setSuccessDialogOpen(false);
    
    console.log('🔍 Registered user data for navigation:', registeredUser);
    
    // Always use the registeredUser data since we're coming from registration
    if (registeredUser && registeredUser.isAdmin) {
      console.log('🔄 ADMIN: Navigating to Admin Dashboard');
      navigate('/admin-dashboard', { replace: true });
    } else {
      console.log('🔄 USER: Navigating to User Dashboard');
      navigate('/dashboard', { replace: true });
    }
    
    setRegisteredUser(null);
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a192f 0%, #001e3c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          px: 2,
          position: 'relative',
          width: '100vw',
        }}
      >
        <IconButton
          onClick={handleCloseButton}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            color: 'white',
            bgcolor: 'rgba(255,255,255,0.1)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', transform: 'rotate(90deg)' },
            zIndex: 1300,
            width: 48,
            height: 48,
            transition: 'all 0.3s ease',
          }}
        >
          <CloseIcon sx={{ fontSize: 24 }} />
        </IconButton>

        <Container maxWidth="sm" sx={{ width: '100%', maxWidth: '450px !important' }}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 40px rgba(0, 0, 0, 0.4)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
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
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #42a5f5 0%, #90caf9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                TradeShift
              </Typography>
            </Box>

            <Typography variant="body1" align="center" sx={{ mb: 3, color: 'rgba(255,255,255,0.85)' }}>
              Your Financial Portfolio Management Platform
            </Typography>

            <Tabs
              value={tab}
              onChange={handleTabChange}
              centered
              sx={{
                mb: 3,
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 600,
                  textTransform: 'none',
                },
                '& .Mui-selected': {
                  color: '#42a5f5 !important',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#42a5f5',
                  height: 3,
                  borderRadius: 2,
                },
              }}
            >
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                  color: '#ff6b6b',
                  border: '1px solid rgba(211, 47, 47, 0.3)',
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {tab === 1 && (
                <>
                  <TextField 
                    fullWidth 
                    label="Full Name" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    margin="normal" 
                    required 
                    disabled={loading} 
                    sx={fieldStyle} 
                  />
                  <TextField 
                    fullWidth 
                    label="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    margin="normal" 
                    required 
                    disabled={loading} 
                    sx={fieldStyle} 
                  />
                  <TextField 
                    fullWidth 
                    label="Contact Number (Optional)" 
                    value={contactNo} 
                    onChange={(e) => setContactNo(e.target.value)} 
                    margin="normal" 
                    disabled={loading} 
                    sx={fieldStyle} 
                  />
                </>
              )}

              {/* Role Selection - Show in both Sign In and Sign Up */}
              <FormControl fullWidth sx={fieldStyle}>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Role</InputLabel>
                <Select 
                  value={tab === 0 ? loginRole : role} 
                  onChange={(e) => {
                    if (tab === 0) {
                      setLoginRole(e.target.value);
                    } else {
                      setRole(e.target.value);
                    }
                  }} 
                  label="Role" 
                  required 
                  disabled={loading} 
                  sx={{ color: 'white' }}
                >
                  <MenuItem value="ROLE_USER">User</MenuItem>
                  <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                </Select>
              </FormControl>

              <TextField 
                fullWidth 
                label="Email Address" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                margin="normal" 
                required 
                disabled={loading} 
                sx={fieldStyle} 
              />
              <TextField 
                fullWidth 
                label="Password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                margin="normal" 
                required 
                disabled={loading} 
                sx={fieldStyle} 
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  borderRadius: 2,
                  mb: 2,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : tab === 0 ? 'Sign In' : 'Create Account'}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleBackToHome}
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'rgba(255,255,255,0.8)',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Back to Home
              </Button>
            </form>

            <Typography variant="caption" align="center" sx={{ mt: 3, display: 'block', color: 'rgba(255,255,255,0.6)' }}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={handleSuccessDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #0a192f 0%, #001e3c 100%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 40px rgba(0, 0, 0, 0.4)',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
          </Box>
          <Typography variant="h5" fontWeight={700} color="white">
            Registration Successful!
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body1" color="rgba(255,255,255,0.9)" sx={{ mb: 2 }}>
            {registeredUser?.isAdmin ? (
              <>🎉 Welcome Admin! Your account has been created successfully. {allUsersData.length > 0 ? `You have access to ${allUsersData.length} users.` : 'You now have admin privileges.'}</>
            ) : (
              <>🎉 Welcome to TradeShift! Your account has been created successfully.</>
            )}
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.7)">
            {registeredUser?.isAdmin 
              ? 'You can now manage users and access administrative features.' 
              : 'You can now start managing your financial portfolio and track your investments.'}
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3, px: 3 }}>
          <Button
            variant="outlined"
            onClick={handleSuccessDialogClose}
            sx={{
              color: 'rgba(255,255,255,0.8)',
              borderColor: 'rgba(255,255,255,0.3)',
              fontWeight: 600,
              textTransform: 'none',
              px: 4,
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            Continue Registration
          </Button>
          <Button
            variant="contained"
            onClick={handleGoToDashboard}
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              fontWeight: 600,
              textTransform: 'none',
              px: 4,
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)',
              }
            }}
          >
            {registeredUser?.isAdmin ? 'Go to Admin Dashboard' : 'Go to Dashboard'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const fieldStyle = {
  mb: 2,
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    input: { color: '#fff' },
    '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' },
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