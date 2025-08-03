import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Slider,
  Switch,
  FormControlLabel,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Timeline as TimelineIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Fullscreen as FullscreenIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import Plot from 'react-plotly.js';

const chartTypes = [
  { value: 'bar', label: 'Bar Chart', icon: '📊' },
  { value: 'line', label: 'Line Chart', icon: '📈' },
  { value: 'scatter', label: 'Scatter Plot', icon: '🔵' },
  { value: 'pie', label: 'Pie Chart', icon: '🥧' },
  { value: 'histogram', label: 'Histogram', icon: '📊' },
  { value: 'box', label: 'Box Plot', icon: '📦' },
  { value: 'heatmap', label: 'Heatmap', icon: '🔥' },
  { value: 'area', label: 'Area Chart', icon: '📊' }
];

const colorPalettes = [
  { name: 'Default', colors: ['#1976d2', '#d81b60', '#388e3c', '#fbc02d', '#ff5722'] },
  { name: 'Pastel', colors: ['#ffcdd2', '#f8bbd9', '#e1bee7', '#d1c4e9', '#c5cae9'] },
  { name: 'Vibrant', colors: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5'] },
  { name: 'Monochrome', colors: ['#000000', '#333333', '#666666', '#999999', '#cccccc'] }
];

export default function ChartBuilder({ analytics }) {
  const [chartType, setChartType] = useState('bar');
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [colorColumn, setColorColumn] = useState('');
  const [chartData, setChartData] = useState(null);
  const [chartLayout, setChartLayout] = useState({});
  const [chartConfig, setChartConfig] = useState({
    title: '',
    showLegend: true,
    colorPalette: 'Default',
    opacity: 0.8,
    showGrid: true,
    responsive: true
  });

  useEffect(() => {
    if (analytics && analytics.schema.length > 0) {
      setXColumn(analytics.schema[0][0]);
      setYColumn(analytics.schema[1] ? analytics.schema[1][0] : analytics.schema[0][0]);
    }
  }, [analytics]);

  useEffect(() => {
    if (analytics && xColumn && yColumn) {
      generateChart();
    }
  }, [analytics, chartType, xColumn, yColumn, colorColumn, chartConfig]);

  const generateChart = () => {
    if (!analytics || !xColumn || !yColumn) return;

    const data = analytics.sample.map(row => ({
      x: row[xColumn],
      y: row[yColumn],
      color: colorColumn ? row[colorColumn] : undefined
    }));

    let plotData = [];
    const selectedPalette = colorPalettes.find(p => p.name === chartConfig.colorPalette);

    switch (chartType) {
      case 'bar':
        plotData = [{
          x: data.map(d => d.x),
          y: data.map(d => d.y),
          type: 'bar',
          marker: {
            color: selectedPalette.colors[0],
            opacity: chartConfig.opacity
          },
          name: yColumn
        }];
        break;

      case 'line':
        plotData = [{
          x: data.map(d => d.x),
          y: data.map(d => d.y),
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: selectedPalette.colors[0] },
          marker: { 
            color: selectedPalette.colors[0],
            opacity: chartConfig.opacity
          },
          name: yColumn
        }];
        break;

      case 'scatter':
        plotData = [{
          x: data.map(d => d.x),
          y: data.map(d => d.y),
          type: 'scatter',
          mode: 'markers',
          marker: {
            color: selectedPalette.colors[0],
            opacity: chartConfig.opacity,
            size: 8
          },
          name: yColumn
        }];
        break;

      case 'pie':
        const aggregated = data.reduce((acc, d) => {
          acc[d.x] = (acc[d.x] || 0) + d.y;
          return acc;
        }, {});
        
        plotData = [{
          labels: Object.keys(aggregated),
          values: Object.values(aggregated),
          type: 'pie',
          marker: {
            colors: selectedPalette.colors.slice(0, Object.keys(aggregated).length)
          }
        }];
        break;

      case 'histogram':
        plotData = [{
          x: data.map(d => d.y),
          type: 'histogram',
          marker: {
            color: selectedPalette.colors[0],
            opacity: chartConfig.opacity
          },
          name: yColumn
        }];
        break;

      case 'box':
        plotData = [{
          y: data.map(d => d.y),
          type: 'box',
          marker: {
            color: selectedPalette.colors[0]
          },
          name: yColumn
        }];
        break;

      default:
        plotData = [{
          x: data.map(d => d.x),
          y: data.map(d => d.y),
          type: chartType,
          marker: {
            color: selectedPalette.colors[0],
            opacity: chartConfig.opacity
          },
          name: yColumn
        }];
    }

    const layout = {
      title: chartConfig.title || `${chartTypes.find(t => t.value === chartType)?.label} of ${yColumn} vs ${xColumn}`,
      xaxis: {
        title: xColumn,
        showgrid: chartConfig.showGrid,
        automargin: true
      },
      yaxis: {
        title: yColumn,
        showgrid: chartConfig.showGrid,
        automargin: true
      },
      showlegend: chartConfig.showLegend,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#333' },
      margin: { l: 80, r: 80, t: 100, b: 80 },
      autosize: true,
      height: undefined
    };

    setChartData(plotData);
    setChartLayout(layout);
  };

  const handleSaveChart = () => {
    const chartConfig = {
      type: chartType,
      xColumn,
      yColumn,
      colorColumn,
      layout: chartLayout,
      config: chartConfig
    };
    localStorage.setItem('savedChart', JSON.stringify(chartConfig));
    // You could also save to backend here
  };

  const handleDownloadChart = () => {
    if (chartData) {
      const link = document.createElement('a');
      link.download = `chart_${chartType}_${Date.now()}.png`;
      link.href = document.querySelector('.js-plotly-plot svg').outerHTML;
      link.click();
    }
  };

  if (!analytics) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <TimelineIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Data Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload and analyze data first to create visualizations
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Chart Controls */}
        <Grid item xs={12} lg={3} xl={2}>
          <Card sx={{ height: 'fit-content', position: 'sticky', top: 16 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chart Configuration
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Chart Type</InputLabel>
                <Select
                  value={chartType}
                  label="Chart Type"
                  onChange={(e) => setChartType(e.target.value)}
                >
                  {chartTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{type.icon}</span>
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>X Axis</InputLabel>
                <Select
                  value={xColumn}
                  label="X Axis"
                  onChange={(e) => setXColumn(e.target.value)}
                >
                  {analytics.schema.map(([name]) => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Y Axis</InputLabel>
                <Select
                  value={yColumn}
                  label="Y Axis"
                  onChange={(e) => setYColumn(e.target.value)}
                >
                  {analytics.schema.map(([name]) => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Color By (Optional)</InputLabel>
                <Select
                  value={colorColumn}
                  label="Color By (Optional)"
                  onChange={(e) => setColorColumn(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  {analytics.schema.map(([name]) => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Divider sx={{ my: 2 }} />

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">Advanced Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    fullWidth
                    label="Chart Title"
                    value={chartConfig.title}
                    onChange={(e) => setChartConfig({...chartConfig, title: e.target.value})}
                    sx={{ mb: 2 }}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Color Palette</InputLabel>
                    <Select
                      value={chartConfig.colorPalette}
                      label="Color Palette"
                      onChange={(e) => setChartConfig({...chartConfig, colorPalette: e.target.value})}
                    >
                      {colorPalettes.map(palette => (
                        <MenuItem key={palette.name} value={palette.name}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {palette.colors.slice(0, 3).map((color, i) => (
                                <Box
                                  key={i}
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    bgcolor: color,
                                    border: '1px solid #ddd'
                                  }}
                                />
                              ))}
                            </Box>
                            {palette.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Typography gutterBottom>Opacity</Typography>
                  <Slider
                    value={chartConfig.opacity}
                    onChange={(e, value) => setChartConfig({...chartConfig, opacity: value})}
                    min={0.1}
                    max={1}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                    sx={{ mb: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={chartConfig.showLegend}
                        onChange={(e) => setChartConfig({...chartConfig, showLegend: e.target.checked})}
                      />
                    }
                    label="Show Legend"
                    sx={{ mb: 1 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={chartConfig.showGrid}
                        onChange={(e) => setChartConfig({...chartConfig, showGrid: e.target.checked})}
                      />
                    }
                    label="Show Grid"
                  />
                </AccordionDetails>
              </Accordion>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Tooltip title="Save Chart">
                  <IconButton color="primary" onClick={handleSaveChart}>
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download Chart">
                  <IconButton color="primary" onClick={handleDownloadChart}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share Chart">
                  <IconButton color="primary">
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Fullscreen">
                  <IconButton color="primary">
                    <FullscreenIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart Display */}
        <Grid item xs={12} lg={9} xl={10}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Chart Preview</Typography>
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={generateChart}
                  variant="outlined"
                  size="small"
                >
                  Refresh
                </Button>
              </Box>
              
              {chartData ? (
                <Paper sx={{ p: 2, bgcolor: '#fafafa' }} elevation={1}>
                  <Plot
                    data={chartData}
                    layout={chartLayout}
                    config={{
                      responsive: true,
                      displayModeBar: true,
                      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
                      displaylogo: false,
                      toImageButtonOptions: {
                        format: 'png',
                        filename: 'chart',
                        height: 800,
                        width: 1200,
                        scale: 2
                      }
                    }}
                    style={{ width: '100%', height: '70vh', minHeight: '600px' }}
                    useResizeHandler={true}
                    onInitialized={(figure) => {
                      // Force resize after initialization
                      setTimeout(() => {
                        window.dispatchEvent(new Event('resize'));
                      }, 100);
                    }}
                  />
                </Paper>
              ) : (
                <Box sx={{ 
                  height: '70vh', 
                  minHeight: '600px',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: '#fafafa',
                  borderRadius: 1
                }}>
                  <Typography color="text.secondary">
                    Select chart type and columns to generate visualization
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 