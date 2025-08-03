import pandas as pd
import numpy as np
import logging
from app.config import Config
from app.services.hdfs_utils import list_hdfs_directory
import requests
import json
from io import StringIO

# Set up logging
logger = logging.getLogger(__name__)

def fix_datanode_url(url):
    """Replace hostname with IP address in DataNode URLs"""
    # Replace quickstart.cloudera with the IP address
    fixed_url = url.replace('quickstart.cloudera', '192.168.0.184')
    return fixed_url

def normalize_hdfs_path(hdfs_path):
    """Normalize HDFS path to ensure it's a relative path for WebHDFS"""
    # If it's a full HDFS URI, extract just the path part
    if hdfs_path.startswith('hdfs://'):
        # Remove the hdfs://host:port part
        path_parts = hdfs_path.split('/', 3)  # Split after hdfs://host:port
        if len(path_parts) >= 4:
            return '/' + path_parts[3]  # Return the path part
        else:
            return '/'
    else:
        # If it's already a relative path, ensure it starts with /
        if not hdfs_path.startswith('/'):
            return '/' + hdfs_path
        return hdfs_path

def download_hdfs_file(hdfs_path):
    """Download file from HDFS using WebHDFS REST API"""
    try:
        logger.info(f"Downloading from HDFS path: {hdfs_path}")
        
        # Normalize the path
        normalized_path = normalize_hdfs_path(hdfs_path)
        
        # Use WebHDFS to read the file
        webhdfs_url = f"{Config.HDFS_URL}/webhdfs/v1{normalized_path}?op=OPEN&user.name={Config.HDFS_USER}"
        
        response = requests.get(webhdfs_url, stream=True, allow_redirects=False)
        
        if response.status_code == 307:  # Redirect to DataNode
            # Get the redirect URL and fix the hostname
            datanode_url = response.headers['Location']
            
            # Fix the hostname in the URL
            fixed_datanode_url = fix_datanode_url(datanode_url)
            
            # Download from DataNode with fixed URL
            download_response = requests.get(fixed_datanode_url, stream=True)
            if download_response.status_code == 200:
                # Read the CSV content
                content = download_response.content.decode('utf-8')
                return content
            else:
                raise Exception(f"Failed to download from DataNode: {download_response.status_code} - {download_response.text}")
        elif response.status_code == 200:
            # Direct response (no redirect)
            content = response.content.decode('utf-8')
            return content
        else:
            raise Exception(f"Failed to download file: {response.status_code} - {response.text}")
            
    except Exception as e:
        logger.error(f"Error downloading file: {str(e)}")
        raise

def analyze_csv_data(csv_content):
    """Analyze CSV data using pandas"""
    try:
        # Read CSV from string content
        df = pd.read_csv(StringIO(csv_content))
        
        logger.info(f"DataFrame loaded with {len(df)} rows and {len(df.columns)} columns")
        
        # Get schema
        schema = [(col, str(dtype)) for col, dtype in df.dtypes.items()]
        
        # Get sample data
        sample = df.head(5).to_dict(orient='records')
        
        # Get row count
        row_count = len(df)
        
        # Analyze columns
        col_stats = []
        summary_lines = []
        
        for column in df.columns:
            logger.info(f"Analyzing column: {column}")
            
            col_data = df[column]
            dtype = str(col_data.dtype)
            
            # Basic stats
            missing = col_data.isnull().sum()
            unique = col_data.nunique()
            
            stat = {
                "name": column,
                "type": dtype,
                "missing": int(missing),
                "unique": int(unique)
            }
            
            # Numeric analysis
            if pd.api.types.is_numeric_dtype(col_data):
                try:
                    stat.update({
                        "mean": float(col_data.mean()) if not pd.isna(col_data.mean()) else None,
                        "std": float(col_data.std()) if not pd.isna(col_data.std()) else None,
                        "min": float(col_data.min()) if not pd.isna(col_data.min()) else None,
                        "max": float(col_data.max()) if not pd.isna(col_data.max()) else None,
                        "median": float(col_data.median()) if not pd.isna(col_data.median()) else None,
                    })
                    
                    # Mode
                    mode_values = col_data.mode()
                    stat["mode"] = float(mode_values.iloc[0]) if len(mode_values) > 0 else None
                    
                    summary_lines.append(f"Column '{column}' (numeric): min={stat['min']}, max={stat['max']}, mean={stat['mean']:.2f}, median={stat['median']}, missing={missing}, unique={unique}.")
                    
                except Exception as e:
                    logger.warning(f"Could not analyze numeric column {column}: {e}")
                    stat.update({"mean": None, "std": None, "min": None, "max": None, "median": None, "mode": None})
                    summary_lines.append(f"Column '{column}' (numeric): analysis failed, missing={missing}, unique={unique}.")
            else:
                # Non-numeric analysis
                try:
                    mode_values = col_data.mode()
                    stat["mode"] = str(mode_values.iloc[0]) if len(mode_values) > 0 else None
                    summary_lines.append(f"Column '{column}' (type: {dtype}): missing={missing}, unique={unique}, mode={stat['mode']}.")
                except Exception as e:
                    logger.warning(f"Could not analyze non-numeric column {column}: {e}")
                    stat["mode"] = None
                    summary_lines.append(f"Column '{column}' (type: {dtype}): missing={missing}, unique={unique}.")
            
            col_stats.append(stat)
        
        # Create summary paragraph
        summary_para = f"The dataset contains {row_count} rows and {len(df.columns)} columns. " + ' '.join(summary_lines)
        
        logger.info("Analysis completed successfully")
        
        return {
            "schema": schema,
            "sample": sample,
            "row_count": row_count,
            "columns": col_stats,
            "summary": summary_para
        }
        
    except Exception as e:
        logger.error(f"Error analyzing CSV data: {str(e)}")
        raise Exception(f"Analysis failed: {str(e)}")

def analyze_hdfs_file_simple(hdfs_path):
    """Analyze HDFS file using simple pandas approach"""
    try:
        logger.info(f"Starting simple analysis for HDFS path: {hdfs_path}")
        
        # Download file from HDFS
        csv_content = download_hdfs_file(hdfs_path)
        
        # Analyze the data
        result = analyze_csv_data(csv_content)
        
        return result
        
    except Exception as e:
        logger.error(f"Error in analyze_hdfs_file_simple: {str(e)}")
        raise Exception(f"Analysis failed: {str(e)}") 