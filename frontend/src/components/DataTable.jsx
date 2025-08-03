import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Sort as SortIcon
} from '@mui/icons-material';

export default function DataTable({ analytics }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterColumn, setFilterColumn] = useState('');
  const [filterValue, setFilterValue] = useState('');

  if (!analytics) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <VisibilityIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Data Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload and analyze data first to view the data table
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleDownload = () => {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateCSV = () => {
    const headers = analytics.schema.map(([name]) => name).join(',');
    const rows = analytics.sample.map(row => 
      Object.values(row).map(val => `"${val}"`).join(',')
    ).join('\n');
    return `${headers}\n${rows}`;
  };

  // Filter and sort data
  let filteredData = analytics.sample;

  // Apply search filter
  if (searchTerm) {
    filteredData = filteredData.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  // Apply column filter
  if (filterColumn && filterValue) {
    filteredData = filteredData.filter(row =>
      String(row[filterColumn]).toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  // Apply sorting
  if (sortColumn) {
    filteredData.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Data Table</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Download CSV">
              <IconButton color="primary" onClick={handleDownload}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Search and Filter Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search all columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Filter Column</InputLabel>
            <Select
              value={filterColumn}
              label="Filter Column"
              onChange={(e) => setFilterColumn(e.target.value)}
            >
              <MenuItem value="">All Columns</MenuItem>
              {analytics.schema.map(([name]) => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {filterColumn && (
            <TextField
              placeholder={`Filter ${filterColumn}...`}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
          )}
        </Box>

        {/* Results Summary */}
        <Alert severity="info" sx={{ mb: 2 }}>
          Showing {paginatedData.length} of {filteredData.length} rows 
          {filteredData.length !== analytics.sample.length && ` (filtered from ${analytics.sample.length} total)`}
        </Alert>

        {/* Data Table */}
        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {analytics.schema.map(([name, type]) => (
                  <TableCell key={name}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2">{name}</Typography>
                      <Chip 
                        label={type} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                      <Tooltip title={`Sort by ${name}`}>
                        <IconButton
                          size="small"
                          onClick={() => handleSort(name)}
                          color={sortColumn === name ? 'primary' : 'default'}
                        >
                          <SortIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, idx) => (
                <TableRow key={idx} hover>
                  {Object.values(row).map((value, i) => (
                    <TableCell key={i}>
                      <Typography variant="body2">
                        {value === null || value === undefined ? (
                          <Chip label="NULL" size="small" color="error" variant="outlined" />
                        ) : (
                          String(value)
                        )}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
        />
      </CardContent>
    </Card>
  );
} 