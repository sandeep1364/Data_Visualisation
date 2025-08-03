import requests
import os
import re
import socket
from app.config import Config

def get_webhdfs_url(path, operation):
    """Build WebHDFS URL for a specific operation"""
    config = Config()
    base_url = config.HDFS_URL.rstrip('/')
    return f"{base_url}/webhdfs/v1{path}?op={operation}&user.name={config.HDFS_USER}"

def fix_datanode_url(url):
    """Replace hostname with IP address in DataNode URLs"""
    # Get the current HDFS IP
    config = Config()
    current_ip = config.get_hdfs_ip()
    
    # Replace quickstart.cloudera with the current IP address
    fixed_url = url.replace('quickstart.cloudera', current_ip)
    
    # Also replace any other hostnames that might be in the URL
    # Extract IP from URL if it contains a different IP
    ip_pattern = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
    ips_in_url = re.findall(ip_pattern, url)
    
    for old_ip in ips_in_url:
        if old_ip != current_ip:
            fixed_url = fixed_url.replace(old_ip, current_ip)
    
    return fixed_url

def upload_to_hdfs(local_path, hdfs_path):
    """Upload file to HDFS using direct WebHDFS REST API"""
    try:
        # Step 1: Create file (this returns a redirect to a DataNode)
        create_url = get_webhdfs_url(hdfs_path, 'CREATE')
        create_params = {'overwrite': 'true'}
        
        response = requests.put(create_url, params=create_params, allow_redirects=False)
        
        if response.status_code == 307:  # Redirect to DataNode
            # Step 2: Get the redirect URL and fix the hostname
            datanode_url = response.headers['Location']
            
            # Fix the hostname in the URL
            fixed_datanode_url = fix_datanode_url(datanode_url)
            
            # Step 3: Upload to DataNode with fixed URL
            with open(local_path, 'rb') as f:
                upload_response = requests.put(fixed_datanode_url, data=f, headers={'Content-Type': 'application/octet-stream'})
            
            if upload_response.status_code == 201:
                return hdfs_path
            else:
                raise Exception(f"Upload failed: {upload_response.status_code} - {upload_response.text}")
        else:
            raise Exception(f"Create failed: {response.status_code} - {response.text}")
            
    except Exception as e:
        raise Exception(f"Failed to upload to HDFS: {str(e)}")

def list_hdfs_directory(path='/'):
    """List HDFS directory using direct WebHDFS REST API"""
    try:
        list_url = get_webhdfs_url(path, 'LISTSTATUS')
        response = requests.get(list_url)
        
        if response.status_code == 200:
            data = response.json()
            return [item['pathSuffix'] for item in data['FileStatuses']['FileStatus']]
        else:
            raise Exception(f"List failed: {response.status_code} - {response.text}")
            
    except Exception as e:
        raise Exception(f"Failed to list HDFS directory: {str(e)}")

def test_hdfs_connection():
    """Test HDFS connection and return status"""
    try:
        config = Config()
        ip = config.get_hdfs_ip()
        url = f"http://{ip}:{config.WEBHDFS_PORT}/webhdfs/v1/?op=LISTSTATUS"
        
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return {
                'status': 'connected',
                'ip': ip,
                'url': url
            }
        else:
            return {
                'status': 'error',
                'ip': ip,
                'error': f"HTTP {response.status_code}: {response.text}"
            }
    except Exception as e:
        return {
            'status': 'error',
            'error': str(e)
        }
