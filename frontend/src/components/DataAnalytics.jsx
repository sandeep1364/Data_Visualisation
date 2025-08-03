import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Analytics as AnalyticsIcon,
  TableChart as TableChartIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

export default function DataAnalytics({ analytics, loading, onAnalyze, uploadData }) {
  const [expanded, setExpanded] = useState('panel1');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!uploadData) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <AnalyticsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Data Available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Upload a file first to perform data analysis
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6">Analyzing Data...</Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Data Analysis</Typography>
            <Button
              variant="contained"
              startIcon={<AnalyticsIcon />}
              onClick={onAnalyze}
            >
              Analyze Data
            </Button>
          </Box>
          <Alert severity="info">
            Click "Analyze Data" to perform comprehensive analysis of your uploaded file.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getDataTypeColor = (type) => {
    const colors = {
      'string': 'primary',
      'integer': 'success',
      'float': 'warning',
      'boolean': 'error',
      'date': 'info'
    };
    return colors[type.toLowerCase()] || 'default';
  };

  const getDataQualityScore = (column) => {
    const missingRatio = column.missing / analytics.sample.length;
    if (missingRatio < 0.05) return { score: 'Excellent', color: 'success' };
    if (missingRatio < 0.1) return { score: 'Good', color: 'warning' };
    return { score: 'Poor', color: 'error' };
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Grid container spacing={3} sx={{ width: '100%', maxWidth: '100%' }}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Total Columns
                  </Typography>
                  <Typography variant="h4">
                    {analytics.schema.length}
                  </Typography>
                </Box>
                <TableChartIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Sample Rows
                  </Typography>
                  <Typography variant="h4">
                    {analytics.sample.length}
                  </Typography>
                </Box>
                <AssessmentIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Data Quality
                  </Typography>
                  <Typography variant="h4">
                    {Math.round((1 - analytics.columns.reduce((sum, col) => sum + col.missing, 0) / (analytics.sample.length * analytics.columns.length)) * 100)}%
                  </Typography>
                </Box>
                <VisibilityIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    File Size
                  </Typography>
                  <Typography variant="h4">
                    {uploadData.size ? `${(uploadData.size / 1024 / 1024).toFixed(1)} MB` : 'N/A'}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Analysis */}
        <Grid item xs={12}>
          <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TableChartIcon />
                <Typography variant="h6">Data Schema & Sample</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={5}>
                  <Typography variant="subtitle1" gutterBottom>Data Schema</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Column</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Quality</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analytics.schema.map(([name, type]) => {
                          const column = analytics.columns.find(col => col.name === name);
                          const quality = column ? getDataQualityScore(column) : { score: 'Unknown', color: 'default' };
                          return (
                            <TableRow key={name}>
                              <TableCell>{name}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={type} 
                                  size="small" 
                                  color={getDataTypeColor(type)}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={quality.score} 
                                  size="small" 
                                  color={quality.color}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} lg={7}>
                  <Typography variant="subtitle1" gutterBottom>Sample Data</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          {Object.keys(analytics.sample[0] || {}).map(col => (
                            <TableCell key={col}>{col}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analytics.sample.slice(0, 5).map((row, idx) => (
                          <TableRow key={idx}>
                            {Object.values(row).map((val, i) => (
                              <TableCell key={i}>{String(val)}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12}>
          <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssessmentIcon />
                <Typography variant="h6">Statistical Analysis</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Column</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Missing</TableCell>
                      <TableCell>Unique</TableCell>
                      <TableCell>Mean</TableCell>
                      <TableCell>Median</TableCell>
                      <TableCell>Mode</TableCell>
                      <TableCell>Min</TableCell>
                      <TableCell>Max</TableCell>
                      <TableCell>Std Dev</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analytics.columns.map(col => (
                      <TableRow key={col.name}>
                        <TableCell>{col.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={col.type} 
                            size="small" 
                            color={getDataTypeColor(col.type)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={col.missing} 
                            size="small" 
                            color={col.missing > 0 ? 'error' : 'success'}
                          />
                        </TableCell>
                        <TableCell>{col.unique}</TableCell>
                        <TableCell>{col.mean?.toFixed(2) || '-'}</TableCell>
                        <TableCell>{col.median?.toFixed(2) || '-'}</TableCell>
                        <TableCell>{col.mode || '-'}</TableCell>
                        <TableCell>{col.min || '-'}</TableCell>
                        <TableCell>{col.max || '-'}</TableCell>
                        <TableCell>{col.std?.toFixed(2) || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {analytics.summary && (
          <Grid item xs={12}>
            <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon />
                  <Typography variant="h6">Data Insights</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Alert severity="info" sx={{ mb: 2 }}>
                  {analytics.summary}
                </Alert>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Download Report">
                    <IconButton color="primary">
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share Analysis">
                    <IconButton color="primary">
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}
      </Grid>
    </Box>
  );
} 