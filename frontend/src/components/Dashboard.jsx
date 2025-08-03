import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Avatar,
  Divider,
  Paper,
  Tabs,
  Tab,
  Fab,
  Snackbar,
  Alert,
  CircularProgress,
  LinearProgress,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CloudUpload as CloudUploadIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Fullscreen as FullscreenIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  DataUsage as DataUsageIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import FileUpload from './FileUpload';
import DataAnalytics from './DataAnalytics';
import ChartBuilder from './ChartBuilder';
import DataTable from './DataTable';
import SystemStatus from './SystemStatus';
import SettingsPanel from './SettingsPanel';
import axios from 'axios';

  const drawerWidth = 280;
  const isLargeScreen = window.innerWidth >= 1200;

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [uploadData, setUploadData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [systemStatus, setSystemStatus] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);

  // System status polling
  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const response = await axios.get('/api/system/status');
        setSystemStatus(response.data);
      } catch (err) {
        console.error('Failed to fetch system status:', err);
      }
    };

    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000); // Poll every 30 seconds
    setRefreshInterval(interval);

    return () => clearInterval(interval);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleAnalyze = async () => {
    if (!uploadData) return;
    
    setLoading(true);
    setError('');
    try {
      const hdfsPath = uploadData?.hdfs_uri || uploadData?.hdfs_path || '';
      const response = await axios.post('/analyze/preview', {
        hdfs_path: hdfsPath
      });
      setAnalytics(response.data);
      setSuccess('Data analysis completed successfully!');
    } catch (err) {
      setError('Analysis failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (data) => {
    setUploadData(data);
    setSuccess('File uploaded successfully!');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleRefresh = () => {
    if (uploadData) {
      handleAnalyze();
    }
  };

  const drawerItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, tab: 0 },
    { text: 'Data Upload', icon: <CloudUploadIcon />, tab: 1 },
    { text: 'Analytics', icon: <AnalyticsIcon />, tab: 2 },
    { text: 'Visualizations', icon: <TimelineIcon />, tab: 3 },
    { text: 'Data Table', icon: <DataUsageIcon />, tab: 4 },
    { text: 'System Status', icon: <SpeedIcon />, tab: 5 },
    { text: 'Settings', icon: <SettingsIcon />, tab: 6 },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, textAlign: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 1, bgcolor: 'primary.main' }}>
          <DataUsageIcon />
        </Avatar>
        <Typography variant="h6" color="primary" gutterBottom>
          IntelliView
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Data Visualization Platform
        </Typography>
      </Box>
      
      <List sx={{ flex: 1, pt: 1 }}>
        {drawerItems.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={currentTab === item.tab}
            onClick={() => handleTabChange(null, item.tab)}
            sx={{
              mx: 1,
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: currentTab === item.tab ? 'inherit' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
      <Divider />
      <Box sx={{ p: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={handleDarkModeToggle}
              color="primary"
            />
          }
          label={darkMode ? 'Dark Mode' : 'Light Mode'}
        />
      </Box>
    </Box>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="textSecondary" gutterBottom variant="overline">
                          Files Uploaded
                        </Typography>
                        <Typography variant="h4">
                          {uploadData ? '1' : '0'}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <CloudUploadIcon />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="textSecondary" gutterBottom variant="overline">
                          Data Size
                        </Typography>
                        <Typography variant="h4">
                          {uploadData ? `${(uploadData.size / 1024 / 1024).toFixed(1)} MB` : '0 MB'}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <StorageIcon />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="textSecondary" gutterBottom variant="overline">
                          System Status
                        </Typography>
                        <Typography variant="h4">
                          {systemStatus.status === 'healthy' ? 'Online' : 'Offline'}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: systemStatus.status === 'healthy' ? 'success.main' : 'error.main' }}>
                        <SpeedIcon />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="textSecondary" gutterBottom variant="overline">
                          Charts Created
                        </Typography>
                        <Typography variant="h4">
                          {analytics ? '1' : '0'}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: 'warning.main' }}>
                        <TimelineIcon />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quick Actions
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Chip
                          icon={<CloudUploadIcon />}
                          label="Upload New File"
                          onClick={() => handleTabChange(null, 1)}
                          color="primary"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <Chip
                          icon={<AnalyticsIcon />}
                          label="Analyze Data"
                          onClick={handleAnalyze}
                          disabled={!uploadData || loading}
                          color="secondary"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <Chip
                          icon={<TimelineIcon />}
                          label="Create Chart"
                          onClick={() => handleTabChange(null, 3)}
                          disabled={!analytics}
                          color="success"
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Upload
              </Typography>
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <DataAnalytics 
            analytics={analytics} 
            loading={loading} 
            onAnalyze={handleAnalyze}
            uploadData={uploadData}
          />
        );
      case 3:
        return (
          <ChartBuilder analytics={analytics} />
        );
      case 4:
        return (
          <DataTable analytics={analytics} />
        );
      case 5:
        return (
          <SystemStatus status={systemStatus} />
        );
      case 6:
        return (
          <SettingsPanel />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: darkMode ? 'grey.900' : 'grey.50' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {drawerItems[currentTab]?.text || 'Dashboard'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton color="inherit" onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Account">
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, lg: 4 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Box sx={{ 
          width: '100%', 
          maxWidth: '100%',
          height: '100%'
        }}>
          {loading && <LinearProgress sx={{ mb: 2 }} />}
          {renderTabContent()}
        </Box>
      </Box>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
      </Menu>
      
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess('')}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}