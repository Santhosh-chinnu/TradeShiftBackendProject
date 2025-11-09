import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  ShoppingCart,
  ArrowUpward as ArrowUp,
  ArrowDownward as ArrowDown,
  AccountBalance as DollarSign,
  Logout,
  Person,
  Settings,
  Notifications,
  SwapHoriz,
  AccountBalanceWallet,
  History,
  Security,
  Add,
  Remove,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// 🧠 Mock Data
const mockData = {
  stats: {
    totalPortfolioValue: 25430,
    todayChange: 457.74,
    todayChangePercent: 1.8,
    totalAssets: 8,
    activeOrders: 3,
    totalGainLoss: 1271.5,
  },
  recentOrders: [
    { id: 1, symbol: 'AAPL', side: 'BUY', status: 'FILLED', amount: 2500 },
    { id: 2, symbol: 'TSLA', side: 'SELL', status: 'PENDING', amount: 1800 },
    { id: 3, symbol: 'GOOGL', side: 'BUY', status: 'FILLED', amount: 3200 },
  ],
  topAssets: [
    { symbol: 'AAPL', currentValue: 8500, change: 2.3 },
    { symbol: 'MSFT', currentValue: 6200, change: 1.7 },
    { symbol: 'GOOGL', currentValue: 5800, change: -0.8 },
    { symbol: 'TSLA', currentValue: 3200, change: 4.2 },
    { symbol: 'AMZN', currentValue: 2800, change: 0.5 },
  ],
  chartData: [
    { date: 'Mon', value: 23500 },
    { date: 'Tue', value: 24100 },
    { date: 'Wed', value: 23800 },
    { date: 'Thu', value: 24700 },
    { date: 'Fri', value: 25200 },
    { date: 'Sat', value: 25430 },
    { date: 'Sun', value: 25350 },
  ],
};

// Quick Actions Component
const QuickActions = ({ navigate }) => {
  const actions = [
    {
      title: 'Trade',
      icon: <SwapHoriz />,
      color: '#1976d2',
      onClick: () => navigate('/trading'),
    },
    {
      title: 'Portfolio',
      icon: <AccountBalanceWallet />,
      color: '#2e7d32',
      onClick: () => navigate('/portfolio'),
    },
    {
      title: 'History',
      icon: <History />,
      color: '#ed6c02',
      onClick: () => navigate('/history'),
    },
    {
      title: 'Buy',
      icon: <Add />,
      color: '#2e7d32',
      onClick: () => navigate('/trading?action=buy'),
    },
    {
      title: 'Sell',
      icon: <Remove />,
      color: '#d32f2f',
      onClick: () => navigate('/trading?action=sell'),
    },
  ];

  return (
    <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: '#132f4c' }}>
      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: 'white' }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {actions.map((action, index) => (
          <Grid item xs={4} sm={2.4} key={index}>
            <Card
              onClick={action.onClick}
              sx={{
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: '#1e3a5c',
                color: 'white',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                  backgroundColor: '#2d4a6e',
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    backgroundColor: `${action.color}20`,
                    color: action.color,
                    mb: 1,
                    mx: 'auto',
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="body2" fontWeight={500}>
                  {action.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [topAssets, setTopAssets] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  // ✅ Load data
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setStats(mockData.stats);
        setRecentOrders(mockData.recentOrders);
        setTopAssets(mockData.topAssets);
        setChartData(mockData.chartData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setStats(mockData.stats);
        setRecentOrders(mockData.recentOrders);
        setTopAssets(mockData.topAssets);
        setChartData(mockData.chartData);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // User menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  // 📊 Helper components
  const StatCard = ({ title, value, change, icon: Icon, color, onClick }) => (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        backgroundColor: '#132f4c',
        color: 'white',
        '&:hover': onClick ? { 
          transform: 'translateY(-2px)', 
          boxShadow: 3,
          backgroundColor: '#1e3a5c',
        } : {},
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              backgroundColor: `${color}20`,
              color: color,
              mr: 2,
            }}
          >
            <Icon />
          </Box>
          <Typography variant="body2" sx={{ color: '#b0bec5' }} fontWeight={500}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
          {typeof value === 'number' && title.includes('$') 
            ? `$${value.toLocaleString()}` 
            : value
          }
        </Typography>
        {change && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {change.startsWith('+') ? (
              <TrendingUp sx={{ fontSize: 16, color: '#2e7d32' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: '#d32f2f' }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: change.startsWith('+') ? '#2e7d32' : '#d32f2f',
                fontWeight: 500,
              }}
            >
              {change}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'FILLED':
        return '#2e7d32';
      case 'PENDING':
        return '#ed6c02';
      case 'REJECTED':
        return '#d32f2f';
      default:
        return '#757575';
    }
  };

  const getSideColor = (side) => (side === 'BUY' ? '#2e7d32' : '#d32f2f');

  // 🌀 Loading spinner
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          backgroundColor: '#0a1929',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 🧠 Main dashboard layout
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0a1929' }}>
      {/* Simple Header */}
      <AppBar position="static" elevation={1} sx={{ backgroundColor: '#132f4c' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DollarSign sx={{ fontSize: 28 }} />
            <Typography variant="h6" fontWeight={600}>
              TradeShift
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
            <Button
              onClick={handleMenuOpen}
              sx={{
                color: 'white',
                textTransform: 'none',
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 1,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  fontSize: '0.875rem',
                }}
              >
                {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </Avatar>
              {user?.name || user?.username}
            </Button>
          </Box>

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: '#132f4c',
                color: 'white',
              }
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <Person sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Settings sx={{ mr: 2 }} />
              Settings
            </MenuItem>
            <Divider sx={{ bgcolor: '#2d4a6e' }} />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
            Welcome back, {user?.name || user?.username}!
          </Typography>
          <Typography variant="body1" sx={{ color: '#b0bec5' }}>
            Here's your portfolio summary
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* 📈 Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Portfolio Value"
              value={stats.totalPortfolioValue}
              change={`+$${stats.todayChange?.toFixed(0)} (${stats.todayChangePercent}%)`}
              icon={DollarSign}
              color="#1976d2"
              onClick={() => navigate('/portfolio')}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Gain/Loss"
              value={stats.totalGainLoss}
              change={
                stats.totalGainLoss >= 0
                  ? `+${((stats.totalGainLoss / stats.totalPortfolioValue) * 100).toFixed(1)}%`
                  : `${((stats.totalGainLoss / stats.totalPortfolioValue) * 100).toFixed(1)}%`
              }
              icon={TrendingUp}
              color={stats.totalGainLoss >= 0 ? '#2e7d32' : '#d32f2f'}
              onClick={() => navigate('/history')}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Assets"
              value={stats.totalAssets}
              icon={PieChart}
              color="#ed6c02"
              onClick={() => navigate('/portfolio')}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Orders"
              value={stats.activeOrders}
              icon={ShoppingCart}
              color="#7b1fa2"
              onClick={() => navigate('/trading')}
            />
          </Grid>

          {/* 📊 Portfolio Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: '#132f4c' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: 'white' }}>
                Portfolio Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d4a6e" />
                  <XAxis dataKey="date" stroke="#b0bec5" />
                  <YAxis stroke="#b0bec5" />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
                    contentStyle={{ backgroundColor: '#1e3a5c', borderColor: '#2d4a6e', color: 'white' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#90caf9"
                    strokeWidth={2}
                    dot={{ fill: '#90caf9' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* 🧾 Recent Orders */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%', backgroundColor: '#132f4c' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: 'white' }}>
                  Recent Orders
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/trading')}
                  sx={{ color: '#90caf9' }}
                >
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'white' }}>Symbol</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'white' }}>Side</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: 'white' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 2 }}>
                          <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                            No recent orders
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentOrders.map((order) => (
                        <TableRow key={order.id} hover sx={{ '&:hover': { backgroundColor: '#1e3a5c' } }}>
                          <TableCell>
                            <Typography fontWeight={600} sx={{ color: 'white' }}>{order.symbol}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {order.side === 'BUY' ? (
                                <ArrowUp sx={{ fontSize: 16, color: '#2e7d32' }} />
                              ) : (
                                <ArrowDown sx={{ fontSize: 16, color: '#d32f2f' }} />
                              )}
                              <Typography
                                variant="body2"
                                sx={{ color: getSideColor(order.side), fontWeight: 600 }}
                              >
                                {order.side}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={order.status}
                              size="small"
                              sx={{
                                backgroundColor: `${getStatusColor(order.status)}20`,
                                color: getStatusColor(order.status),
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* 💰 Top Assets */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: '#132f4c' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: 'white' }}>
                Top Assets
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topAssets}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d4a6e" />
                  <XAxis dataKey="symbol" stroke="#b0bec5" />
                  <YAxis stroke="#b0bec5" />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
                    contentStyle={{ backgroundColor: '#1e3a5c', borderColor: '#2d4a6e', color: 'white' }}
                  />
                  <Bar dataKey="currentValue" fill="#90caf9" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* 🚀 Quick Actions */}
          <Grid item xs={12} md={6}>
            <QuickActions navigate={navigate} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}