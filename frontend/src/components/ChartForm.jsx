import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

const chartTypes = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'scatter', label: 'Scatter Plot' },
  { value: 'pie', label: 'Pie Chart' },
  { value: 'heatmap', label: 'Heatmap' },
];

export default function ChartForm({ columns = [], onChartChange }) {
  // For now, just stub out chart type selection
  return (
    <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2, mb: 2 }}>
      <Typography variant="h6">Chart Options</Typography>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Chart Type</InputLabel>
        <Select label="Chart Type" defaultValue="bar" onChange={e => onChartChange?.({ chartType: e.target.value })}>
          {chartTypes.map(type => (
            <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Column selection will be added after file upload */}
    </Box>
  );
}