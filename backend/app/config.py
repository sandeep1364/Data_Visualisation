import os
import socket
import subprocess
import platform
from pathlib import Path

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'supersecretkey')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwtsecret')
    
    # HDFS Configuration with dynamic IP discovery
    HDFS_HOSTNAME = os.environ.get('HDFS_HOSTNAME', 'quickstart.cloudera')
    HDFS_USER = os.environ.get('HDFS_USER', 'cloudera')
    
    # Ports
    WEBHDFS_PORT = os.environ.get('WEBHDFS_PORT', '50070')  # WebHDFS port for Hadoop 2.x
    HDFS_PORT = os.environ.get('HDFS_PORT', '8020')  # HDFS port
    
    @classmethod
    def get_hdfs_ip(cls):
        """Dynamically discover HDFS server IP address"""
        # Load .env file if it exists
        cls._load_env_file()
        
        # Check if we should force a specific IP
        if os.environ.get('FORCE_IP', 'false').lower() == 'true':
            forced_ip = os.environ.get('HDFS_IP')
            if forced_ip and cls._test_hdfs_connection(forced_ip):
                return forced_ip
        
        # Try multiple methods to find the HDFS server IP
        
        # Method 1: Try to resolve hostname
        try:
            ip = socket.gethostbyname(cls.HDFS_HOSTNAME)
            if cls._test_hdfs_connection(ip):
                return ip
        except socket.gaierror:
            pass
        
        # Method 2: Try common local network ranges
        common_ips = [
            '192.168.0.184',  # Your current IP
            '192.168.1.100',
            '192.168.1.101',
            '192.168.0.100',
            '192.168.0.101',
            '10.0.0.100',
            '172.16.0.100'
        ]
        
        for ip in common_ips:
            if cls._test_hdfs_connection(ip):
                return ip
        
        # Method 3: Scan local network (Windows)
        if platform.system() == 'Windows':
            local_ip = cls._get_local_ip()
            if local_ip:
                network_prefix = '.'.join(local_ip.split('.')[:-1])
                for i in range(1, 255):
                    test_ip = f"{network_prefix}.{i}"
                    if cls._test_hdfs_connection(test_ip):
                        return test_ip
        
        # Fallback to environment variable or default
        return os.environ.get('HDFS_IP', '192.168.1.56')
    
    @classmethod
    def _test_hdfs_connection(cls, ip):
        """Test if HDFS is accessible at the given IP"""
        try:
            import requests
            url = f"http://{ip}:{cls.WEBHDFS_PORT}/webhdfs/v1/?op=LISTSTATUS"
            response = requests.get(url, timeout=2)
            return response.status_code == 200
        except:
            return False
    
    @classmethod
    def _get_local_ip(cls):
        """Get local machine IP address"""
        try:
            # Connect to a remote address to determine local IP
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            s.close()
            return local_ip
        except:
            return None
    
    @classmethod
    def _load_env_file(cls):
        """Load environment variables from .env file"""
        env_file = Path(__file__).parent.parent / '.env'
        if env_file.exists():
            with open(env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        os.environ[key.strip()] = value.strip()
    
    @property
    def HDFS_URL(self):
        """Dynamic HDFS URL"""
        ip = self.get_hdfs_ip()
        return f"http://{ip}:{self.WEBHDFS_PORT}"
    
    @property
    def HDFS_URI_PREFIX(self):
        """Dynamic HDFS URI prefix"""
        ip = self.get_hdfs_ip()
        return f"hdfs://{ip}:{self.HDFS_PORT}"
