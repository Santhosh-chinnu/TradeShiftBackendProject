import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Card,
  CardContent,
  Divider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Fixed: Direct configuration - update this for different environments
const API_BASE_URL = 'http://localhost:8080/api';

export default function TradingPage() {
  const { user } = useAuth();
  const [side, setSide] = useState('BUY');
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [orderType, setOrderType] = useState('LIMIT');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [recentOrders, setRecentOrders] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [marketPrice, setMarketPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadBrokerageAccounts();
      loadRecentOrders();
    }
  }, [user]);

  // Fetch market price when symbol changes
  useEffect(() => {
    if (symbol && symbol.length >= 2) {
      fetchMarketPrice(symbol);
    } else {
      setMarketPrice(null);
    }
  }, [symbol]);

  const loadBrokerageAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('brokerage_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      
      setAccounts(data || []);
      if (data && data.length > 0) {
        setSelectedAccount(data[0].id);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
      setMessage({ type: 'error', text: 'Failed to load brokerage accounts' });
    }
  };

  const loadRecentOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('trade_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentOrders(data || []);
    } catch (error) {
      console.error('Failed to load recent orders:', error);
    }
  };

  const fetchMarketPrice = async (symbol) => {
    setPriceLoading(true);
    try {
      // Mock market price - in real app, this would call a market data API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate different prices for different symbols
      const mockPrices = {
        'AAPL': 185.42,
        'TSLA': 245.67,
        'GOOGL': 138.25,
        'MSFT': 378.91,
        'AMZN': 154.23,
        'NVDA': 485.76,
        'META': 348.12,
      };
      
      const price = mockPrices[symbol.toUpperCase()] || (Math.random() * 500 + 10).toFixed(2);
      setMarketPrice(parseFloat(price));
      
      // Auto-fill price for user convenience
      if (!price) {
        setPrice(price.toFixed(2));
      }
    } catch (error) {
      console.error('Failed to fetch market price:', error);
    } finally {
      setPriceLoading(false);
    }
  };

  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    if (!user || !selectedAccount) {
      setMessage({ type: 'error', text: 'Please select an account' });
      return;
    }

    if (!symbol || !quantity || !price) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = await getAuthToken();
      const qty = parseFloat(quantity);
      const px = parseFloat(price);

      // Validate sufficient funds for BUY orders
      const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);
      if (side === 'BUY' && selectedAccountData) {
        const totalCost = qty * px;
        if (totalCost > selectedAccountData.balance) {
          throw new Error(`Insufficient funds. Required: $${totalCost.toFixed(2)}, Available: $${selectedAccountData.balance.toFixed(2)}`);
        }
      }

      const orderRequest = {
        symbol: symbol.toUpperCase(),
        quantity: qty,
        price: px,
        side: side,
        order_type: orderType,
        account_id: selectedAccount,
        user_id: user.id,
      };

      console.log('Placing order:', orderRequest);

      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll create a mock response
      const mockResponse = {
        id: Date.now(),
        ...orderRequest,
        status: 'PENDING',
        created_at: new Date().toISOString(),
        filled_quantity: 0,
        remaining_quantity: qty,
      };

      // Update recent orders
      setRecentOrders(prev => [mockResponse, ...prev.slice(0, 4)]);
      
      // Update account balance for BUY orders
      if (side === 'BUY') {
        const updatedAccounts = accounts.map(acc => 
          acc.id === selectedAccount 
            ? { ...acc, balance: acc.balance - (qty * px) }
            : acc
        );
        setAccounts(updatedAccounts);
      }

      setMessage({
        type: 'success',
        text: `${side} order placed successfully for ${qty} shares of ${symbol.toUpperCase()} at $${px}`,
      });
      setSnackbarOpen(true);
      
      // Reset form
      setSymbol('');
      setQuantity('');
      setPrice('');
      setMarketPrice(null);
    } catch (error) {
      console.error('Trade error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to place trade order. Please try again.',
      });
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const handleUseMarketPrice = () => {
    if (marketPrice) {
      setPrice(marketPrice.toFixed(2));
    }
  };

  const estimatedTotal = parseFloat(quantity || '0') * parseFloat(price || '0');
  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);
  const accountBalance = selectedAccountData?.balance || 0;
  const insufficientFunds = side === 'BUY' && estimatedTotal > accountBalance;

  const getStatusColor = (status) => {
    switch (status) {
      case 'FILLED': return '#10b981';
      case 'PENDING': return '#f59e0b';
      case 'PARTIALLY_FILLED': return '#3b82f6';
      case 'REJECTED': return '#ef4444';
      case 'CANCELLED': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getSideColor = (side) => {
    return side === 'BUY' ? '#10b981' : '#ef4444';
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ 
      p: 2, 
      pl: 3, 
      pr: 0,
      backgroundColor: '#0a1929',
      minHeight: '100vh',
      width: '100%',
      overflowX: 'hidden'
    }}>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
          pr: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
            Trade Execution
          </Typography>
          <Typography variant="body1" sx={{ color: '#b0bec5', mb: 4 }}>
            Execute BUY and SELL orders for your portfolio
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* LEFT SECTION - TRADE FORM */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 2, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            backgroundColor: '#132f4c'
          }}>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: 'white' }}>
              Place Order
            </Typography>

            <ToggleButtonGroup
              value={side}
              exclusive
              onChange={(_, val) => val && setSide(val)}
              fullWidth
              sx={{ mb: 3 }}
            >
              <ToggleButton
                value="BUY"
                sx={{
                  color: 'white',
                  borderColor: '#10b981',
                  '&:hover': {
                    backgroundColor: '#10b98120',
                  },
                  '&.Mui-selected': {
                    bgcolor: '#10b981',
                    color: 'white',
                    fontWeight: 600,
                    borderColor: '#10b981',
                    '&:hover': {
                      bgcolor: '#059669',
                    },
                  },
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 18, mr: 1 }} />
                BUY
              </ToggleButton>
              <ToggleButton
                value="SELL"
                sx={{
                  color: 'white',
                  borderColor: '#ef4444',
                  '&:hover': {
                    backgroundColor: '#ef444420',
                  },
                  '&.Mui-selected': {
                    bgcolor: '#ef4444',
                    color: 'white',
                    fontWeight: 600,
                    borderColor: '#ef4444',
                    '&:hover': {
                      bgcolor: '#dc2626',
                    },
                  },
                }}
              >
                <TrendingDownIcon sx={{ fontSize: 18, mr: 1 }} />
                SELL
              </ToggleButton>
            </ToggleButtonGroup>

            {message.text && (
              <Alert severity={message.type} sx={{ mb: 2, borderRadius: 1 }}>
                {message.text}
              </Alert>
            )}

            {accounts.length === 0 ? (
              <Alert severity="warning" sx={{ mb: 2, borderRadius: 1 }}>
                No active brokerage accounts found. Please connect an account first.
              </Alert>
            ) : (
              <form onSubmit={handleTrade}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: '#b0bec5' }}>Brokerage Account</InputLabel>
                  <Select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    label="Brokerage Account"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#b0bec5',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#b0bec5',
                      },
                    }}
                  >
                    {accounts.map((account) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.account_name} - ${account.balance?.toLocaleString()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: '#b0bec5' }}>Order Type</InputLabel>
                  <Select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    label="Order Type"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#b0bec5',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#b0bec5',
                      },
                    }}
                  >
                    <MenuItem value="LIMIT">Limit Order</MenuItem>
                    <MenuItem value="MARKET">Market Order</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Symbol"
                  placeholder="e.g., AAPL, TSLA, GOOGL"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  margin="normal"
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: {
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#b0bec5',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: { color: '#b0bec5' },
                  }}
                />

                {symbol && (
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {priceLoading ? (
                      <CircularProgress size={20} />
                    ) : marketPrice ? (
                      <>
                        <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                          Current Price: ${marketPrice.toFixed(2)}
                        </Typography>
                        <Button
                          size="small"
                          onClick={handleUseMarketPrice}
                          sx={{ 
                            color: '#90caf9',
                            textTransform: 'none',
                            fontSize: '0.75rem'
                          }}
                        >
                          Use Market Price
                        </Button>
                      </>
                    ) : null}
                  </Box>
                )}

                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  placeholder="Number of shares"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  margin="normal"
                  required
                  inputProps={{ min: 1, step: 1 }}
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: {
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#b0bec5',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: { color: '#b0bec5' },
                  }}
                />

                {orderType === 'LIMIT' && (
                  <TextField
                    fullWidth
                    label="Limit Price ($)"
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    margin="normal"
                    required
                    inputProps={{ min: 0.01, step: 0.01 }}
                    sx={{ mb: 3 }}
                    InputProps={{
                      sx: {
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#b0bec5',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'white',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1976d2',
                        },
                      },
                    }}
                    InputLabelProps={{
                      sx: { color: '#b0bec5' },
                    }}
                  />
                )}

                {/* Order Summary */}
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#1e3a5c', 
                  borderRadius: 2,
                  border: '1px solid #2d4a6e',
                  mb: 3 
                }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: 'white' }}>
                    Order Summary
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                      Side:
                    </Typography>
                    <Chip 
                      label={side}
                      size="small"
                      sx={{ 
                        backgroundColor: getSideColor(side),
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                      Symbol:
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ color: 'white' }}>
                      {symbol || '-'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                      Quantity:
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ color: 'white' }}>
                      {quantity || '0'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                      Price:
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ color: 'white' }}>
                      ${price || '0.00'}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1, bgcolor: '#2d4a6e' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                      Estimated Total:
                    </Typography>
                    <Typography variant="body1" fontWeight={700} color="#90caf9">
                      ${estimatedTotal.toFixed(2)}
                    </Typography>
                  </Box>
                  {insufficientFunds && (
                    <Alert severity="error" sx={{ mt: 1, borderRadius: 1 }}>
                      Insufficient funds for this trade
                    </Alert>
                  )}
                </Box>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading || accounts.length === 0 || insufficientFunds}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: side === 'BUY' 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease',
                    '&:disabled': {
                      opacity: 0.6,
                      transform: 'none',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    `Place ${side} Order`
                  )}
                </Button>
              </form>
            )}
          </Paper>
        </Grid>

        {/* RIGHT SECTION - ACCOUNT INFO & RECENT ORDERS */}
        <Grid item xs={12} md={6}>
          {/* Account Balance Card */}
          <Card sx={{ 
            mb: 3, 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            background: 'linear-gradient(135deg, #1e3a5c 0%, #2d4a6e 100%)',
            color: 'white',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <AccountBalanceIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Account Balance
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    ${accountBalance.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Available for trading
              </Typography>
              {insufficientFunds && (
                <Alert severity="warning" sx={{ mt: 2, borderRadius: 1 }}>
                  Order exceeds available balance
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: 2, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            mb: 3,
            backgroundColor: '#132f4c'
          }}>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: 'white' }}>
              Recent Orders
            </Typography>
            <Divider sx={{ my: 2, bgcolor: '#2d4a6e' }} />
            
            {recentOrders.length === 0 ? (
              <Typography align="center" sx={{ color: '#b0bec5', py: 3 }}>
                No recent orders
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentOrders.map((order) => (
                  <Box
                    key={order.id}
                    sx={{
                      p: 2,
                      border: '1px solid #2d4a6e',
                      borderRadius: 2,
                      bgcolor: '#1e3a5c',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'white' }}>
                        {order.symbol}
                      </Typography>
                      <Chip 
                        label={order.side}
                        size="small"
                        sx={{ 
                          backgroundColor: getSideColor(order.side),
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                        Qty: {order.quantity}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                        ${order.price}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={order.status}
                        size="small"
                        sx={{ 
                          backgroundColor: `${getStatusColor(order.status)}20`,
                          color: getStatusColor(order.status),
                          fontWeight: 600,
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#b0bec5' }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

          {/* Trading Information */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: 2, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            backgroundColor: '#132f4c'
          }}>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: 'white' }}>
              Trading Information
            </Typography>
            <Divider sx={{ my: 2, bgcolor: '#2d4a6e' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#b0bec5' }} gutterBottom>
                  Market Hours
                </Typography>
                <Typography fontWeight={600} sx={{ color: 'white' }}>9:30 AM - 4:00 PM EST</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#b0bec5' }} gutterBottom>
                  Order Types
                </Typography>
                <Typography fontWeight={600} sx={{ color: 'white' }}>Limit & Market Orders</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#b0bec5' }} gutterBottom>
                  Settlement
                </Typography>
                <Typography fontWeight={600} sx={{ color: 'white' }}>T+2 Business Days</Typography>
              </Box>
              <Alert severity="info" sx={{ mt: 1, borderRadius: 1, backgroundColor: '#1e3a5c' }}>
                All orders are subject to market conditions and verification.
                Pending orders will be executed during market hours.
              </Alert>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Back to Dashboard Button at Bottom */}
      <Box sx={{ mt: 4, pr: 3, display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToDashboard}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: '#90caf9',
              backgroundColor: 'rgba(144, 202, 249, 0.1)',
            },
          }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={message.text}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: message.type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            fontWeight: 600,
          },
        }}
      />
    </Box>
  );
}