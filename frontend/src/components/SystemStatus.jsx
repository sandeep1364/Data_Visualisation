import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  NetworkCheck as NetworkIcon,
  Cloud as CloudIcon,
  DataUsage as DataUsageIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import axios from 'axios';

export default function SystemStatus({ status }) {
  const [systemInfo, setSystemInfo] = useState({
    hdfs: { status: 'unknown', details: 'Checking connection...' },
    spark: { status: 'unknown', details: 'Checking connection...' },
    storage: { status: 'unknown', details: 'Checking storage...' },
    performance: { status: 'unknown', details: 'Checking performance...' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemStatus = async () => {
    try {
      // Simulate system status checks
      const mockStatus = {
        hdfs: {
          status: Math.random() > 0.1 ? 'healthy' : 'error',
          details: Math.random() > 0.1 ? 'HDFS connection active' : 'Connection failed',
          metrics: {
            availableSpace: Math.floor(Math.random() * 1000) + 100,
            totalSpace: 2000,
            activeNodes: Math.floor(Math.random() * 5) + 1
          }
        },
        spark: {
          status: Math.random() > 0.05 ? 'healthy' : 'warning',
          details: Math.random() > 0.05 ? 'Spark cluster running' : 'Some nodes offline',
          metrics: {
            activeJobs: Math.floor(Math.random() * 10),
            totalExecutors: Math.floor(Math.random() * 20) + 5,
            memoryUsage: Math.floor(Math.random() * 80) + 20
          }
        },
        storage: {
          status: 'healthy',
          details: 'Local storage available',
          metrics: {
            usedSpace: Math.floor(Math.random() * 500) + 100,
            totalSpace: 1000,
            fileCount: Math.floor(Math.random() * 1000) + 100
          }
        },
        performance: {
          status: Math.random() > 0.2 ? 'healthy' : 'warning',
          details: Math.random() > 0.2 ? 'System performing well' : 'High resource usage',
          metrics: {
            cpuUsage: Math.floor(Math.random() * 60) + 20,
            memoryUsage: Math.floor(Math.random() * 70) + 30,
            networkLatency: Math.floor(Math.random() * 100) + 10
          }
        }
      };

      setSystemInfo(mockStatus);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch system status:', error);
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getProgressColor = (value, threshold = 80) => {
    if (value >= threshold) return 'error';
    if (value >= threshold * 0.7) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6">Loading System Status...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* System Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">System Overview</Typography>
                <Tooltip title="Refresh Status">
                  <IconButton onClick={fetchSystemStatus}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <CloudIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6">HDFS</Typography>
                    <Chip 
                      label={systemInfo.hdfs.status} 
                      color={getStatusColor(systemInfo.hdfs.status)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <SpeedIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="h6">Spark</Typography>
                    <Chip 
                      label={systemInfo.spark.status} 
                      color={getStatusColor(systemInfo.spark.status)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <StorageIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6">Storage</Typography>
                    <Chip 
                      label={systemInfo.storage.status} 
                      color={getStatusColor(systemInfo.storage.status)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <TimelineIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h6">Performance</Typography>
                    <Chip 
                      label={systemInfo.performance.status} 
                      color={getStatusColor(systemInfo.performance.status)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>HDFS Status</Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    {getStatusIcon(systemInfo.hdfs.status)}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Connection Status"
                    secondary={systemInfo.hdfs.details}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Storage Usage"
                    secondary={`${systemInfo.hdfs.metrics.availableSpace}GB / ${systemInfo.hdfs.metrics.totalSpace}GB available`}
                  />
                </ListItem>
                <ListItem>
                  <Box sx={{ width: '100%', ml: 4 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(systemInfo.hdfs.metrics.availableSpace / systemInfo.hdfs.metrics.totalSpace) * 100}
                      color={getProgressColor((systemInfo.hdfs.metrics.availableSpace / systemInfo.hdfs.metrics.totalSpace) * 100)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DataUsageIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Active Nodes"
                    secondary={`${systemInfo.hdfs.metrics.activeNodes} nodes online`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Spark Status</Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    {getStatusIcon(systemInfo.spark.status)}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Cluster Status"
                    secondary={systemInfo.spark.details}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <SpeedIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Active Jobs"
                    secondary={`${systemInfo.spark.metrics.activeJobs} jobs running`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MemoryIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Memory Usage"
                    secondary={`${systemInfo.spark.metrics.memoryUsage}% utilized`}
                  />
                </ListItem>
                <ListItem>
                  <Box sx={{ width: '100%', ml: 4 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={systemInfo.spark.metrics.memoryUsage}
                      color={getProgressColor(systemInfo.spark.metrics.memoryUsage)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DataUsageIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Executors"
                    secondary={`${systemInfo.spark.metrics.totalExecutors} total executors`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>CPU Usage</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={systemInfo.performance.metrics.cpuUsage}
                          color={getProgressColor(systemInfo.performance.metrics.cpuUsage)}
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                      </Box>
                      <Typography variant="body2">{systemInfo.performance.metrics.cpuUsage}%</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Memory Usage</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={systemInfo.performance.metrics.memoryUsage}
                          color={getProgressColor(systemInfo.performance.metrics.memoryUsage)}
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                      </Box>
                      <Typography variant="body2">{systemInfo.performance.metrics.memoryUsage}%</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Network Latency</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(systemInfo.performance.metrics.networkLatency, 100)}
                          color={getProgressColor(systemInfo.performance.metrics.networkLatency, 50)}
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                      </Box>
                      <Typography variant="body2">{systemInfo.performance.metrics.networkLatency}ms</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts */}
        {Object.values(systemInfo).some(info => info.status === 'error' || info.status === 'warning') && (
          <Grid item xs={12}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Some system components require attention. Please check the detailed status above.
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
} 