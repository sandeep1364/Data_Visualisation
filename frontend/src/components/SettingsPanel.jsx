import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Language as LanguageIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

export default function SettingsPanel() {
  const [settings, setSettings] = useState({
    // Appearance
    darkMode: true,
    theme: 'default',
    language: 'en',
    fontSize: 14,
    
    // Notifications
    emailNotifications: false,
    pushNotifications: true,
    soundEnabled: true,
    
    // Performance
    autoRefresh: true,
    refreshInterval: 30,
    maxFileSize: 100,
    compressionEnabled: true,
    
    // Security
    sessionTimeout: 60,
    requireAuth: true,
    dataEncryption: true,
    
    // Data
    defaultChartType: 'bar',
    maxDataPoints: 1000,
    dataRetention: 30,
    backupEnabled: true
  });

  const [saved, setSaved] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    const defaultSettings = {
      darkMode: true,
      theme: 'default',
      language: 'en',
      fontSize: 14,
      emailNotifications: false,
      pushNotifications: true,
      soundEnabled: true,
      autoRefresh: true,
      refreshInterval: 30,
      maxFileSize: 100,
      compressionEnabled: true,
      sessionTimeout: 60,
      requireAuth: true,
      dataEncryption: true,
      defaultChartType: 'bar',
      maxDataPoints: 1000,
      dataRetention: 30,
      backupEnabled: true
    };
    setSettings(defaultSettings);
    setSaved(false);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Settings Header */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Application Settings</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<RefreshIcon />}
                    onClick={handleReset}
                    variant="outlined"
                    size="small"
                  >
                    Reset
                  </Button>
                  <Button
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    variant="contained"
                    size="small"
                  >
                    Save
                  </Button>
                </Box>
              </Box>
              
              {saved && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Settings saved successfully!
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Appearance Settings */}
        <Grid item xs={12} md={6}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaletteIcon />
                <Typography variant="h6">Appearance</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    {settings.darkMode ? <DarkModeIcon /> : <LightModeIcon />}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Dark Mode"
                    secondary="Use dark theme for the application"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.darkMode}
                      onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PaletteIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Theme"
                    secondary="Choose your preferred color theme"
                  />
                  <ListItemSecondaryAction>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={settings.theme}
                        onChange={(e) => handleSettingChange('theme', e.target.value)}
                      >
                        <MenuItem value="default">Default</MenuItem>
                        <MenuItem value="blue">Blue</MenuItem>
                        <MenuItem value="green">Green</MenuItem>
                        <MenuItem value="purple">Purple</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Language"
                    secondary="Select your preferred language"
                  />
                  <ListItemSecondaryAction>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                        <MenuItem value="de">German</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <TimelineIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Font Size"
                    secondary={`${settings.fontSize}px`}
                  />
                  <ListItemSecondaryAction>
                    <Slider
                      value={settings.fontSize}
                      onChange={(e, value) => handleSettingChange('fontSize', value)}
                      min={10}
                      max={20}
                      step={1}
                      marks
                      valueLabelDisplay="auto"
                      sx={{ width: 100 }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon />
                <Typography variant="h6">Notifications</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Notifications"
                    secondary="Receive notifications via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Push Notifications"
                    secondary="Show browser notifications"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Sound Alerts"
                    secondary="Play sound for notifications"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.soundEnabled}
                      onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Performance Settings */}
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon />
                <Typography variant="h6">Performance</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <SpeedIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Auto Refresh"
                    secondary="Automatically refresh data"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.autoRefresh}
                      onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SpeedIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Refresh Interval"
                    secondary={`${settings.refreshInterval} seconds`}
                  />
                  <ListItemSecondaryAction>
                    <Slider
                      value={settings.refreshInterval}
                      onChange={(e, value) => handleSettingChange('refreshInterval', value)}
                      min={10}
                      max={300}
                      step={10}
                      marks
                      valueLabelDisplay="auto"
                      sx={{ width: 100 }}
                      disabled={!settings.autoRefresh}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Max File Size"
                    secondary={`${settings.maxFileSize} MB`}
                  />
                  <ListItemSecondaryAction>
                    <Slider
                      value={settings.maxFileSize}
                      onChange={(e, value) => handleSettingChange('maxFileSize', value)}
                      min={10}
                      max={500}
                      step={10}
                      marks
                      valueLabelDisplay="auto"
                      sx={{ width: 100 }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Data Compression"
                    secondary="Compress data for faster loading"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.compressionEnabled}
                      onChange={(e) => handleSettingChange('compressionEnabled', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon />
                <Typography variant="h6">Security</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Session Timeout"
                    secondary={`${settings.sessionTimeout} minutes`}
                  />
                  <ListItemSecondaryAction>
                    <Slider
                      value={settings.sessionTimeout}
                      onChange={(e, value) => handleSettingChange('sessionTimeout', value)}
                      min={15}
                      max={240}
                      step={15}
                      marks
                      valueLabelDisplay="auto"
                      sx={{ width: 100 }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Require Authentication"
                    secondary="Force login for all operations"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.requireAuth}
                      onChange={(e) => handleSettingChange('requireAuth', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Data Encryption"
                    secondary="Encrypt sensitive data"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.dataEncryption}
                      onChange={(e) => handleSettingChange('dataEncryption', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Data Settings */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StorageIcon />
                <Typography variant="h6">Data Management</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Default Chart Type</InputLabel>
                    <Select
                      value={settings.defaultChartType}
                      label="Default Chart Type"
                      onChange={(e) => handleSettingChange('defaultChartType', e.target.value)}
                    >
                      <MenuItem value="bar">Bar Chart</MenuItem>
                      <MenuItem value="line">Line Chart</MenuItem>
                      <MenuItem value="scatter">Scatter Plot</MenuItem>
                      <MenuItem value="pie">Pie Chart</MenuItem>
                      <MenuItem value="histogram">Histogram</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>Max Data Points</Typography>
                  <Slider
                    value={settings.maxDataPoints}
                    onChange={(e, value) => handleSettingChange('maxDataPoints', value)}
                    min={100}
                    max={10000}
                    step={100}
                    marks
                    valueLabelDisplay="auto"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Maximum data points to display in charts: {settings.maxDataPoints}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>Data Retention (days)</Typography>
                  <Slider
                    value={settings.dataRetention}
                    onChange={(e, value) => handleSettingChange('dataRetention', value)}
                    min={7}
                    max={365}
                    step={7}
                    marks
                    valueLabelDisplay="auto"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Keep data for {settings.dataRetention} days
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.backupEnabled}
                        onChange={(e) => handleSettingChange('backupEnabled', e.target.checked)}
                      />
                    }
                    label="Enable Automatic Backups"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Automatically backup your data and settings
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
} 