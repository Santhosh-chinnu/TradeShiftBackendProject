import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Mock data for watchlist
const mockWatchlist = [
  { id: 1, symbol: 'AAPL', name: 'Apple Inc.', price: 182.63, change: 2.34, changePercent: 1.30 },
  { id: 2, symbol: 'MSFT', name: 'Microsoft Corporation', price: 407.54, change: -1.23, changePercent: -0.30 },
  { id: 3, symbol: 'GOOGL', name: 'Alphabet Inc.', price: 175.22, change: 3.45, changePercent: 2.01 },
  { id: 4, symbol: 'TSLA', name: 'Tesla Inc.', price: 245.18, change: -5.67, changePercent: -2.26 },
  { id: 5, symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.22, change: 1.89, changePercent: 1.07 },
];

export default function WatchlistPage() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSymbol, setNewSymbol] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadWatchlist();
  }, [user]);

  const loadWatchlist = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWatchlist(mockWatchlist);
    } catch (error) {
      console.error('Error loading watchlist:', error);
      setMessage({ type: 'error', text: 'Failed to load watchlist' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSymbol = async () => {
    if (!newSymbol.trim()) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newItem = {
        id: Date.now(),
        symbol: newSymbol.toUpperCase(),
        name: `${newSymbol.toUpperCase()} Company`,
        price: Math.random() * 500,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
      };

      setWatchlist(prev => [newItem, ...prev]);
      setNewSymbol('');
      setMessage({ type: 'success', text: `${newSymbol.toUpperCase()} added to watchlist` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add symbol' });
    }
  };

  const handleRemoveSymbol = async (symbolId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setWatchlist(prev => prev.filter(item => item.id !== symbolId));
      setMessage({ type: 'success', text: 'Symbol removed from watchlist' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove symbol' });
    }
  };

  const getChangeColor = (change) => {
    return change >= 0 ? '#10b981' : '#ef4444';
  };

  const totalChange = watchlist.reduce((sum, item) => sum + item.change, 0);
  const avgChangePercent = watchlist.length > 0 
    ? (watchlist.reduce((sum, item) => sum + item.changePercent, 0) / watchlist.length) 
    : 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Watchlist
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Track your favorite stocks and monitor their performance
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }}>
          {message.text}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#667eea20' }}>
                  <TrendingUp sx={{ color: '#667eea', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Symbols
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {watchlist.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: totalChange >= 0 ? '#10b98120' : '#ef444420' }}>
                  {totalChange >= 0 ? (
                    <TrendingUp sx={{ color: '#10b981', fontSize: 24 }} />
                  ) : (
                    <TrendingDown sx={{ color: '#ef4444', fontSize: 24 }} />
                  )}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Change
                  </Typography>
                  <Typography 
                    variant="h5" 
                    fontWeight={700}
                    color={getChangeColor(totalChange)}
                  >
                    ${totalChange.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: avgChangePercent >= 0 ? '#10b98120' : '#ef444420' }}>
                  {avgChangePercent >= 0 ? (
                    <TrendingUp sx={{ color: '#10b981', fontSize: 24 }} />
                  ) : (
                    <TrendingDown sx={{ color: '#ef4444', fontSize: 24 }} />
                  )}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Avg Change %
                  </Typography>
                  <Typography 
                    variant="h5" 
                    fontWeight={700}
                    color={getChangeColor(avgChangePercent)}
                  >
                    {avgChangePercent.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Symbol Section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Add to Watchlist
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            label="Stock Symbol"
            placeholder="e.g., AAPL, TSLA, GOOGL"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            sx={{ flex: 1 }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddSymbol();
              }
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSymbol}
            disabled={!newSymbol.trim()}
            sx={{
              py: 1.5,
              px: 3,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Add Symbol
          </Button>
        </Box>
      </Paper>

      {/* Watchlist Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Symbol</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Company Name</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Change</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Change %</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {watchlist.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary" gutterBottom>
                    Your watchlist is empty
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add symbols above to start tracking
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              watchlist.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{item.symbol}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {item.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={600}>
                      ${item.price.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      {item.change >= 0 ? (
                        <TrendingUp sx={{ color: '#10b981', fontSize: 18 }} />
                      ) : (
                        <TrendingDown sx={{ color: '#ef4444', fontSize: 18 }} />
                      )}
                      <Typography
                        sx={{
                          color: getChangeColor(item.change),
                          fontWeight: 600,
                        }}
                      >
                        {item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${item.changePercent >= 0 ? '+' : ''}${item.changePercent.toFixed(2)}%`}
                      size="small"
                      sx={{
                        bgcolor: `${getChangeColor(item.changePercent)}20`,
                        color: getChangeColor(item.changePercent),
                        fontWeight: 600,
                        minWidth: 80,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleRemoveSymbol(item.id)}
                      sx={{
                        color: '#ef4444',
                        '&:hover': {
                          backgroundColor: '#ef444410',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}