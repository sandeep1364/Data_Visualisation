import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Description as CsvIcon,
  Code as JsonIcon,
  TableChart as ParquetIcon
} from '@mui/icons-material';
import axios from 'axios';

const MAX_SIZE = 1024 * 1024 * 1024 * 2; // 2GB

const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'csv':
      return <CsvIcon color="primary" />;
    case 'json':
      return <JsonIcon color="secondary" />;
    case 'parquet':
      return <ParquetIcon color="success" />;
    default:
      return <FileIcon color="action" />;
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError('');
    setSuccess(false);
    
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError(`File too large. Maximum size is ${formatFileSize(MAX_SIZE)}`);
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError('Invalid file type. Please upload CSV, JSON, or Parquet files.');
      } else {
        setError('File rejected: ' + rejection.errors[0].message);
      }
      return;
    }
    
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxSize: MAX_SIZE,
    multiple: false,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/octet-stream': ['.parquet'],
    },
  });

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    setError('');
    setSuccess(false);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      
      setSuccess(true);
      setFile(null);
      setProgress(0);
      if (onUploadSuccess) onUploadSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
    setSuccess(false);
    setProgress(0);
  };

  const getDragBorderColor = () => {
    if (isDragReject) return 'error.main';
    if (isDragActive) return 'primary.main';
    return 'divider';
  };

  return (
    <Box>
      {/* Upload Area */}
      <Card 
        variant="outlined" 
        sx={{ 
          border: 2, 
          borderColor: getDragBorderColor(),
          borderStyle: isDragActive ? 'dashed' : 'solid',
          transition: 'all 0.3s ease',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper'
        }}
      >
        <CardContent>
          <div {...getRootProps()} style={{ cursor: 'pointer' }}>
            <input {...getInputProps()} />
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              px: 2
            }}>
              <CloudUploadIcon 
                sx={{ 
                  fontSize: 64, 
                  color: isDragActive ? 'primary.main' : 'text.secondary',
                  mb: 2,
                  transition: 'all 0.3s ease'
                }} 
              />
              
              <Typography variant="h6" gutterBottom>
                {isDragActive 
                  ? (isDragReject ? 'Invalid file type!' : 'Drop your file here...')
                  : 'Drag & drop a file here'
                }
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                or click to browse files
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="CSV" icon={<CsvIcon />} variant="outlined" size="small" />
                <Chip label="JSON" icon={<JsonIcon />} variant="outlined" size="small" />
                <Chip label="Parquet" icon={<ParquetIcon />} variant="outlined" size="small" />
              </Box>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Maximum file size: {formatFileSize(MAX_SIZE)}
              </Typography>
            </Box>
          </div>
        </CardContent>
      </Card>

      {/* File Details */}
      {file && (
        <Collapse in={!!file}>
          <Paper sx={{ mt: 2, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Selected File</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Show Details">
                  <IconButton 
                    size="small" 
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remove File">
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={handleRemoveFile}
                    disabled={uploading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {getFileIcon(file.name)}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" noWrap>
                  {file.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatFileSize(file.size)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={uploading}
                startIcon={uploading ? null : <CloudUploadIcon />}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </Box>
            
            <Collapse in={showDetails}>
              <Divider sx={{ my: 2 }} />
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="File Type"
                    secondary={file.type || 'Unknown'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Last Modified"
                    secondary={new Date(file.lastModified).toLocaleString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="File Path"
                    secondary={file.webkitRelativePath || 'Local file'}
                  />
                </ListItem>
              </List>
            </Collapse>
          </Paper>
        </Collapse>
      )}

      {/* Upload Progress */}
      {uploading && (
        <Paper sx={{ mt: 2, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="body2">Upload Progress</Typography>
            <Typography variant="body2" color="primary">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Paper>
      )}

      {/* Status Messages */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => setError('')}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ mt: 2 }}
          icon={<CheckIcon />}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => setSuccess(false)}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          }
        >
          File uploaded successfully! You can now analyze your data.
        </Alert>
      )}
    </Box>
  );
}