# HDFS Dynamic IP Discovery Setup

This guide explains how to set up and manage HDFS connections that automatically adapt to changing network configurations.

## 🚀 Quick Start

### 1. Test Current Connection
```bash
# Test the current HDFS connection
python test_hdfs_discovery.py

# Or use the Windows batch file
test_hdfs.bat
```

### 2. Scan Network (if needed)
```bash
# Scan your local network for HDFS servers
python network_scanner.py
```

## 🔧 Configuration Options

### Option 1: Automatic Discovery (Recommended)
The system will automatically discover your HDFS server using multiple methods:

1. **Hostname Resolution**: Tries to resolve `quickstart.cloudera`
2. **Common IP Ranges**: Tests common local network IPs
3. **Network Scanning**: Scans your local network subnet

### Option 2: Environment Variables
Set these environment variables to override automatic discovery:

```bash
# Windows
set HDFS_HOSTNAME=your-server-hostname
set HDFS_IP=your-server-ip
set WEBHDFS_PORT=50070
set HDFS_PORT=8020
set HDFS_USER=cloudera

# Linux/Mac
export HDFS_HOSTNAME=your-server-hostname
export HDFS_IP=your-server-ip
export WEBHDFS_PORT=50070
export HDFS_PORT=8020
export HDFS_USER=cloudera
```

### Option 3: .env File
Create a `.env` file in the backend directory:

```bash
# Copy the template
cp hdfs_config.env .env

# Edit the .env file with your settings
```

Example `.env` file:
```env
HDFS_HOSTNAME=quickstart.cloudera
HDFS_IP=192.168.1.56
HDFS_USER=cloudera
WEBHDFS_PORT=50070
HDFS_PORT=8020
FORCE_IP=false
HDFS_TIMEOUT=10
```

## 🔍 Troubleshooting

### Connection Issues

1. **Test Basic Connectivity**
   ```bash
   python test_hdfs_discovery.py
   ```

2. **Scan Network**
   ```bash
   python network_scanner.py
   ```

3. **Check Common Issues**:
   - HDFS server is not running
   - Firewall blocking connections
   - Wrong port numbers
   - Network connectivity issues

### IP Address Changes

When your HDFS server's IP address changes:

1. **Automatic**: The system will automatically detect the new IP
2. **Manual**: Update your `.env` file or environment variables
3. **Force IP**: Set `FORCE_IP=true` in your `.env` file to use a specific IP

### Common Ports

- **WebHDFS**: 50070 (Hadoop 2.x) or 9870 (Hadoop 3.x)
- **HDFS Service**: 8020 or 9000
- **NameNode**: 8020
- **DataNode**: 9864

## 🛠️ Advanced Configuration

### Custom Network Ranges
Edit `backend/app/config.py` to add your custom IP ranges:

```python
# Method 2: Try common local network ranges
common_ips = [
    '192.168.0.184',  # Your current IP
    '192.168.1.100',  # Add your custom IPs here
    '192.168.1.101',
    # ... add more as needed
]
```

### Custom Hostnames
Set the `HDFS_HOSTNAME` environment variable to your server's hostname:

```bash
export HDFS_HOSTNAME=my-hdfs-server.local
```

### Timeout Configuration
Adjust connection timeouts in your `.env` file:

```env
HDFS_TIMEOUT=5  # 5 seconds timeout
```

## 📊 Monitoring

### Check Connection Status
The system provides detailed connection information:

```bash
python test_hdfs_discovery.py
```

Output example:
```
🔍 HDFS Connection Discovery Tool
==================================================
📡 Attempting to discover HDFS server...
✅ Discovered HDFS IP: 192.168.1.56
🔗 Testing connection...
✅ SUCCESS: Connected to HDFS!
📍 IP Address: 192.168.1.56
🌐 URL: http://192.168.1.56:50070/webhdfs/v1/?op=LISTSTATUS
```

### Log Files
Check your application logs for connection details and errors.

## 🔄 Automatic Recovery

The system includes automatic recovery features:

1. **IP Discovery**: Automatically finds the correct IP address
2. **Fallback IPs**: Uses multiple fallback options if primary fails
3. **Connection Testing**: Validates connections before use
4. **Error Handling**: Graceful handling of network issues

## 📝 Best Practices

1. **Use Hostnames**: Configure your HDFS server with a consistent hostname
2. **Static IPs**: Consider using static IP addresses for your HDFS server
3. **Network Configuration**: Ensure your HDFS server is on the same network
4. **Firewall Rules**: Configure firewalls to allow HDFS ports
5. **Regular Testing**: Run connection tests regularly to ensure reliability

## 🆘 Support

If you encounter issues:

1. Run `python test_hdfs_discovery.py` for detailed diagnostics
2. Check the troubleshooting section above
3. Verify your network configuration
4. Ensure your HDFS server is properly configured and running 