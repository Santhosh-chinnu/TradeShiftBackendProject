import { useEffect, useState } from 'react';
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
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ArrowBack,
} from '@mui/icons-material';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function HistoryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [tradeOrders, setTradeOrders] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 0) {
        const { data: ordersData } = await supabase
          .from('trade_orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setTradeOrders(ordersData || []);
      } else {
        const { data: assetsData } = await supabase
          .from('assets')
          .select('*')
          .eq('user_id', user.id)
          .order('symbol', { ascending: true });

        setAssets(assetsData || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'FILLED':
        return { bg: '#d1fae5', color: '#10b981' };
      case 'PENDING':
        return { bg: '#fef3c7', color: '#f59e0b' };
      case 'REJECTED':
        return { bg: '#fee2e2', color: '#ef4444' };
      default:
        return { bg: '#e5e7eb', color: '#6b7280' };
    }
  };

  const getSideColor = (side) => (side === 'BUY' ? '#10b981' : '#ef4444');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const calculateTotalValue = () =>
    assets.reduce(
      (total, asset) =>
        total + parseFloat(asset.quantity) * parseFloat(asset.avgPrice),
      0
    );

  const calculateTotalGainLoss = () =>
    assets.reduce((total, asset) => {
      const currentValue =
        parseFloat(asset.quantity) * parseFloat(asset.avgPrice);
      const purchaseValue = currentValue * 0.95; // simulate 5% gain
      return total + (currentValue - purchaseValue);
    }, 0);

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          backgroundColor: '#001e3c',
          width: '100vw',
        }}
      >
        <CircularProgress sx={{ color: '#42a5f5' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: 3,
        py: 3,
        backgroundColor: '#001e3c',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        color: 'white',
        boxSizing: 'border-box',
      }}
    >
      {/* ===== HEADER SECTION ===== */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Portfolio & History
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          View your assets and trade order history
        </Typography>
      </Box>

      {/* ===== SUMMARY CARDS ===== */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#0a2540', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1, backgroundColor: '#1976d220' }}>
                  <TrendingUp sx={{ color: '#42a5f5' }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#90caf9' }}>
                    Total Assets
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {assets.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#0a2540', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1, backgroundColor: '#2e7d3220' }}>
                  <TrendingUp sx={{ color: '#66bb6a' }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#90caf9' }}>
                    Portfolio Value
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    ${calculateTotalValue().toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#0a2540', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    backgroundColor:
                      calculateTotalGainLoss() >= 0 ? '#2e7d3220' : '#d32f2f20',
                  }}
                >
                  {calculateTotalGainLoss() >= 0 ? (
                    <TrendingUp sx={{ color: '#66bb6a' }} />
                  ) : (
                    <TrendingDown sx={{ color: '#ef5350' }} />
                  )}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#90caf9' }}>
                    Total P&L
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color={
                      calculateTotalGainLoss() >= 0 ? '#66bb6a' : '#ef5350'
                    }
                  >
                    ${calculateTotalGainLoss().toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ===== TABS ===== */}
      <Paper sx={{ mb: 3, backgroundColor: '#0a2540', color: 'white' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              color: 'rgba(255,255,255,0.7)',
            },
            '& .Mui-selected': { color: '#42a5f5' },
            '& .MuiTabs-indicator': { backgroundColor: '#42a5f5' },
          }}
        >
          <Tab label="Trade Orders" />
          <Tab label="Assets" />
        </Tabs>
      </Paper>

      {/* ===== TABLES ===== */}
      {activeTab === 0 ? (
        // Trade Orders Table
        <TableContainer
          component={Paper}
          sx={{ backgroundColor: '#0a2540', color: 'white' }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date & Time</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Side</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Symbol</TableCell>
                <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Quantity</TableCell>
                <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Price</TableCell>
                <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Total Value</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tradeOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="rgba(255,255,255,0.6)">
                      No trade orders yet. Start trading to see your history.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tradeOrders.map((order) => {
                  const totalValue =
                    parseFloat(order.quantity) * parseFloat(order.price);
                  const statusStyle = getStatusColor(order.status);
                  return (
                    <TableRow key={order.id} hover>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <Typography sx={{ color: getSideColor(order.side), fontWeight: 600 }}>
                          {order.side}
                        </Typography>
                      </TableCell>
                      <TableCell>{order.symbol}</TableCell>
                      <TableCell align="right">{order.quantity}</TableCell>
                      <TableCell align="right">${order.price}</TableCell>
                      <TableCell align="right">${totalValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          sx={{
                            bgcolor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Assets Table
        <TableContainer
          component={Paper}
          sx={{ backgroundColor: '#0a2540', color: 'white' }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: 'white' }}>Symbol</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'white' }}>Asset Type</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: 'white' }}>
                  Quantity
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: 'white' }}>
                  Avg Price
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: 'white' }}>
                  Total Value
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: 'white' }}>
                  Current Value
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: 'white' }}>
                  P&L
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="rgba(255,255,255,0.6)">
                      No assets in your portfolio yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                assets.map((asset) => {
                  const totalValue =
                    parseFloat(asset.quantity) * parseFloat(asset.avgPrice);
                  const currentPrice = parseFloat(asset.avgPrice) * 1.05;
                  const currentValue = asset.quantity * currentPrice;
                  const pnl = currentValue - totalValue;
                  const pnlPercentage = (pnl / totalValue) * 100;
                  const isPositive = pnl >= 0;
                  return (
                    <TableRow key={asset.id} hover>
                      <TableCell>{asset.symbol}</TableCell>
                      <TableCell>
                        <Chip
                          label={asset.assetType || 'STOCK'}
                          variant="outlined"
                          size="small"
                          sx={{ color: '#42a5f5', borderColor: '#42a5f5' }}
                        />
                      </TableCell>
                      <TableCell align="right">{asset.quantity}</TableCell>
                      <TableCell align="right">${asset.avgPrice}</TableCell>
                      <TableCell align="right">${totalValue.toLocaleString()}</TableCell>
                      <TableCell align="right">${currentValue.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <Typography
                          sx={{
                            color: isPositive ? '#66bb6a' : '#ef5350',
                            fontWeight: 600,
                          }}
                        >
                          {isPositive ? '+' : ''}${pnl.toFixed(2)} ({pnlPercentage.toFixed(1)}%)
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ===== BOTTOM BACK BUTTON ===== */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 5,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBackToDashboard}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#42a5f5',
            color: '#42a5f5',
            '&:hover': {
              borderColor: '#90caf9',
              backgroundColor: 'rgba(66,165,245,0.1)',
            },
          }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
}
