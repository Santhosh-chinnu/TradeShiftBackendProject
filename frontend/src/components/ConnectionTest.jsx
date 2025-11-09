import { useEffect, useState } from 'react';
import { testConnection } from '../services/api';
import { Alert, Box, Button, Typography } from '@mui/material';

export default function ConnectionTest() {
  const [status, setStatus] = useState('testing...');
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  const testBackendConnection = async () => {
    try {
      setStatus('Testing connection...');
      setError(null);
      
      const response = await testConnection();
      setStatus('✅ Connected successfully!');
      setDetails(response.data);
    } catch (err) {
      setStatus('❌ Connection failed');
      setError(err.message);
      setDetails(null);
    }
  };

  useEffect(() => {
    testBackendConnection();
  }, []);

  return (
    <Box sx={{ p: 3, mb: 3, border: '1px solid', 
               borderColor: error ? 'error.main' : 'success.main', 
               borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        Backend Connection Test
      </Typography>
      
      <Typography variant="body1" gutterBottom>
        Status: <strong>{status}</strong>
      </Typography>

      {details && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Backend Details:
          </Typography>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
            {JSON.stringify(details, null, 2)}
          </pre>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Error:</strong> {error}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Make sure:
          </Typography>
          <ul>
            <li>Spring Boot backend is running on port 8080</li>
            <li>No other applications are using port 8080</li>
            <li>CORS is configured for localhost:5173</li>
          </ul>
        </Alert>
      )}

      <Button 
        variant="outlined" 
        onClick={testBackendConnection}
        sx={{ mt: 2 }}
      >
        Test Connection Again
      </Button>
    </Box>
  );
}