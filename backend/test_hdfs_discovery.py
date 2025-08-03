#!/usr/bin/env python3
"""
Test script to discover and test HDFS connection with dynamic IP detection
"""
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.config import Config
from app.services.hdfs_utils import test_hdfs_connection

def main():
    """Test HDFS connection with dynamic IP discovery"""
    print("🔍 HDFS Connection Discovery Tool")
    print("=" * 50)
    
    # Test dynamic IP discovery
    config = Config()
    print(f"📡 Attempting to discover HDFS server...")
    print(f"🔧 Hostname: {Config.HDFS_HOSTNAME}")
    print(f"🔧 WebHDFS Port: {Config.WEBHDFS_PORT}")
    print(f"🔧 HDFS Port: {Config.HDFS_PORT}")
    print(f"👤 User: {Config.HDFS_USER}")
    
    try:
        # Get discovered IP
        discovered_ip = config.get_hdfs_ip()
        print(f"\n✅ Discovered HDFS IP: {discovered_ip}")
        
        # Test connection
        print(f"\n🔗 Testing connection...")
        result = test_hdfs_connection()
        
        if result['status'] == 'connected':
            print(f"✅ SUCCESS: Connected to HDFS!")
            print(f"📍 IP Address: {result['ip']}")
            print(f"🌐 URL: {result['url']}")
            
            # Show configuration
            print(f"\n📋 Current Configuration:")
            print(f"   HDFS_URL: {config.HDFS_URL}")
            print(f"   HDFS_URI_PREFIX: {config.HDFS_URI_PREFIX}")
            
        else:
            print(f"❌ FAILED: Could not connect to HDFS")
            print(f"📍 Attempted IP: {result.get('ip', 'Unknown')}")
            print(f"🚨 Error: {result.get('error', 'Unknown error')}")
            
            print(f"\n💡 Troubleshooting tips:")
            print(f"   1. Make sure your HDFS server is running")
            print(f"   2. Check if the server is accessible on the network")
            print(f"   3. Verify WebHDFS is enabled on port {Config.WEBHDFS_PORT}")
            print(f"   4. Try setting environment variables:")
            print(f"      export HDFS_HOSTNAME=your-server-hostname")
            print(f"      export HDFS_IP=your-server-ip")
            print(f"      export WEBHDFS_PORT=50070")
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 