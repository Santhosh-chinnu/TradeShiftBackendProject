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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Alert,
  IconButton,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PieChartIcon from '@mui/icons-material/PieChart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../contexts/AuthContext';

const mockPortfolios = [
  { id: 1, name: 'Main Portfolio', owner_id: 1 },
  { id: 2, name: 'Retirement Fund', owner_id: 1 },
];

const mockAssets = [
  { id: 1, portfolio_id: 1, symbol: 'AAPL', asset_type: 'STOCK', quantity: 10, avg_price: 150.5 },
  { id: 2, portfolio_id: 1, symbol: 'TSLA', asset_type: 'STOCK', quantity: 5, avg_price: 250.75 },
  { id: 3, portfolio_id: 1, symbol: 'GOOGL', asset_type: 'STOCK', quantity: 3, avg_price: 2800.0 },
  { id: 4, portfolio_id: 2, symbol: 'VOO', asset_type: 'ETF', quantity: 15, avg_price: 420.3 },
];

export default function PortfolioPage() {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addAssetOpen, setAddAssetOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState('');
  const [newAsset, setNewAsset] = useState({
    symbol: '',
    assetType: 'STOCK',
    quantity: '',
    avgPrice: '',
  });

  useEffect(() => {
    const loadPortfoliosAndAssets = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setPortfolios(mockPortfolios);

        if (mockPortfolios.length > 0) {
          setSelectedPortfolio(mockPortfolios[0].id);
          const portfolioAssets = mockAssets.filter(
            (asset) => asset.portfolio_id === mockPortfolios[0].id
          );
          setAssets(portfolioAssets);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setPortfolios([]);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    loadPortfoliosAndAssets();
  }, [user]);

  const loadAssetsForPortfolio = async (portfolioId) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const portfolioAssets = mockAssets.filter((asset) => asset.portfolio_id === portfolioId);
      setAssets(portfolioAssets);
    } catch (error) {
      console.error('Error loading assets:', error);
      setAssets([]);
    }
  };

  const handlePortfolioChange = (portfolioId) => {
    setSelectedPortfolio(portfolioId);
    loadAssetsForPortfolio(portfolioId);
  };

  const handleAddAsset = async () => {
    if (!selectedPortfolio) {
      alert('Please select a portfolio first.');
      return;
    }

    // Validation
    if (!newAsset.symbol.trim()) {
      alert('Please enter a symbol.');
      return;
    }

    if (!newAsset.quantity || parseFloat(newAsset.quantity) <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    if (!newAsset.avgPrice || parseFloat(newAsset.avgPrice) <= 0) {
      alert('Please enter a valid average price.');
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newAssetData = {
        id: Date.now(),
        portfolio_id: parseInt(selectedPortfolio),
        symbol: newAsset.symbol.toUpperCase(),
        asset_type: newAsset.assetType,
        quantity: parseFloat(newAsset.quantity),
        avg_price: parseFloat(newAsset.avgPrice),
      };

      // Update mockAssets for persistence (in real app, this would be an API call)
      mockAssets.push(newAssetData);
      
      // Update local state
      setAssets((prev) => [...prev, newAssetData]);
      setAddAssetOpen(false);
      setNewAsset({
        symbol: '',
        assetType: 'STOCK',
        quantity: '',
        avgPrice: '',
      });
      
      console.log('Asset added successfully:', newAssetData);
    } catch (error) {
      console.error('Error adding asset:', error);
      alert('Failed to add asset. Please try again.');
    }
  };

  const calculateTotalPortfolioValue = () => {
    return assets.reduce((total, asset) => {
      return total + parseFloat(asset.quantity) * parseFloat(asset.avg_price);
    }, 0);
  };

  const calculateTotalGainLoss = () => {
    return assets.reduce((total, asset) => {
      const currentValue = parseFloat(asset.quantity) * parseFloat(asset.avg_price) * 1.05;
      const purchaseValue = parseFloat(asset.quantity) * parseFloat(asset.avg_price);
      return total + (currentValue - purchaseValue);
    }, 0);
  };

  const calculateAssetCurrentValue = (asset) => {
    return parseFloat(asset.quantity) * parseFloat(asset.avg_price) * 1.05;
  };

  const calculateAssetGainLoss = (asset) => {
    const purchaseValue = parseFloat(asset.quantity) * parseFloat(asset.avg_price);
    const currentValue = calculateAssetCurrentValue(asset);
    const gainLoss = currentValue - purchaseValue;
    const gainLossPercent = (gainLoss / purchaseValue) * 100;
    return { gainLoss, gainLossPercent };
  };

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const resetNewAssetForm = () => {
    setNewAsset({
      symbol: '',
      assetType: 'STOCK',
      quantity: '',
      avgPrice: '',
    });
  };

  const handleDialogClose = () => {
    setAddAssetOpen(false);
    resetNewAssetForm();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100vw',
          backgroundColor: '#132f4c',
          overflowX: 'hidden',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: 3,
        py: 3,
        backgroundColor: '#132f4c',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        margin: 0,
        color: 'white',
        position: 'relative',
      }}
    >
      {/* Back Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToDashboard}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            backgroundColor: 'white',
            color: '#132f4c',
            '&:hover': { backgroundColor: '#f5f5f5' },
          }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Portfolio Management
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Manage your investment portfolios and assets
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#1e3a5c', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PieChartIcon sx={{ color: '#90caf9' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                    Total Portfolios
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {portfolios.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#1e3a5c', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccountBalanceIcon sx={{ color: '#81c784' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                    Portfolio Value
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    ${calculateTotalPortfolioValue().toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#1e3a5c', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {calculateTotalGainLoss() >= 0 ? (
                  <TrendingUpIcon sx={{ color: '#81c784' }} />
                ) : (
                  <TrendingDownIcon sx={{ color: '#ef5350' }} />
                )}
                <Box>
                  <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                    Total P&L
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color={calculateTotalGainLoss() >= 0 ? '#81c784' : '#ef5350'}
                  >
                    ${calculateTotalGainLoss().toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Portfolio Selector and Add Asset Button */}
      {portfolios.length > 0 && (
        <Paper
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: '#1e3a5c',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Select Portfolio
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {portfolios.map((portfolio) => (
                <Chip
                  key={portfolio.id}
                  label={portfolio.name}
                  onClick={() => handlePortfolioChange(portfolio.id)}
                  variant={selectedPortfolio === portfolio.id ? 'filled' : 'outlined'}
                  color={selectedPortfolio === portfolio.id ? 'primary' : 'default'}
                  sx={{
                    fontWeight: 500,
                    color: 'white',
                    borderColor: 'white',
                    '&.MuiChip-filled': { backgroundColor: 'white', color: '#132f4c' },
                  }}
                />
              ))}
            </Box>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddAssetOpen(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: 'white',
              color: '#132f4c',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          >
            Add Asset
          </Button>
        </Paper>
      )}

      {/* Portfolio Table */}
      {portfolios.length === 0 ? (
        <Alert severity="info" sx={{ backgroundColor: '#1e3a5c', color: 'white' }}>
          No portfolios found. Please create a portfolio first to start adding assets.
        </Alert>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: '#1e3a5c',
            color: 'white',
            '& .MuiTableCell-root': { color: 'white' },
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Symbol</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Asset Type</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Quantity
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Avg Price
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Current Value
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Gain/Loss
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="rgba(255,255,255,0.7)" gutterBottom>
                      No assets in this portfolio yet.
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setAddAssetOpen(true)}
                      sx={{
                        mt: 1,
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                      }}
                    >
                      Add Your First Asset
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                assets.map((asset) => {
                  const { gainLoss, gainLossPercent } = calculateAssetGainLoss(asset);
                  const isPositive = gainLoss >= 0;
                  const currentValue = calculateAssetCurrentValue(asset);

                  return (
                    <TableRow key={asset.id} hover sx={{ '&:hover': { backgroundColor: '#2a4a6c' } }}>
                      <TableCell>
                        <Typography fontWeight={600}>{asset.symbol}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={asset.asset_type}
                          size="small"
                          sx={{
                            backgroundColor: 'transparent',
                            borderColor: 'white',
                            color: 'white',
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {parseFloat(asset.quantity).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        ${parseFloat(asset.avg_price).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>
                          ${currentValue.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: 1,
                          }}
                        >
                          {isPositive ? (
                            <TrendingUpIcon sx={{ color: '#81c784', fontSize: 18 }} />
                          ) : (
                            <TrendingDownIcon sx={{ color: '#ef5350', fontSize: 18 }} />
                          )}
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography
                              sx={{
                                color: isPositive ? '#81c784' : '#ef5350',
                                fontWeight: 600,
                              }}
                            >
                              {isPositive ? '+' : ''}${gainLoss.toFixed(2)}
                            </Typography>
                            <Chip
                              label={`${isPositive ? '+' : ''}${gainLossPercent.toFixed(1)}%`}
                              size="small"
                              sx={{
                                backgroundColor: isPositive
                                  ? '#81c78430'
                                  : '#ef535030',
                                color: isPositive ? '#81c784' : '#ef5350',
                                fontWeight: 600,
                                mt: 0.5,
                              }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Floating Add Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add asset"
        onClick={() => setAddAssetOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: 'white',
          color: '#132f4c',
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
          display: { xs: 'flex', md: 'none' },
        }}
      >
        <AddIcon />
      </Fab>

      {/* Add Asset Dialog */}
      <Dialog 
        open={addAssetOpen} 
        onClose={handleDialogClose} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={600}>
              Add New Asset
            </Typography>
            <IconButton onClick={handleDialogClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Symbol"
              placeholder="e.g., AAPL, TSLA, GOOGL"
              value={newAsset.symbol}
              onChange={(e) => setNewAsset({ ...newAsset, symbol: e.target.value })}
              margin="normal"
              required
              autoFocus
            />
            <TextField
              fullWidth
              select
              label="Asset Type"
              value={newAsset.assetType}
              onChange={(e) => setNewAsset({ ...newAsset, assetType: e.target.value })}
              margin="normal"
              required
            >
              <MenuItem value="STOCK">Stock</MenuItem>
              <MenuItem value="ETF">ETF</MenuItem>
              <MenuItem value="CRYPTO">Cryptocurrency</MenuItem>
              <MenuItem value="BOND">Bond</MenuItem>
              <MenuItem value="MUTUAL_FUND">Mutual Fund</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={newAsset.quantity}
              onChange={(e) => setNewAsset({ ...newAsset, quantity: e.target.value })}
              margin="normal"
              required
              inputProps={{ min: 0, step: 0.001 }}
            />
            <TextField
              fullWidth
              label="Average Price ($)"
              type="number"
              value={newAsset.avgPrice}
              onChange={(e) => setNewAsset({ ...newAsset, avgPrice: e.target.value })}
              margin="normal"
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddAsset}
            disabled={!newAsset.symbol.trim() || !newAsset.quantity || !newAsset.avgPrice}
            startIcon={<AddIcon />}
          >
            Add Asset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}