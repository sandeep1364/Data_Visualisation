#!/usr/bin/env python3
"""
Network scanner to discover HDFS servers on the local network
"""
import socket
import threading
import time
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

def scan_port(ip, port, timeout=1):
    """Scan a specific IP and port"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((ip, port))
        sock.close()
        return result == 0
    except:
        return False

def test_hdfs_webui(ip, port=50070):
    """Test if HDFS WebUI is accessible"""
    try:
        url = f"http://{ip}:{port}/webhdfs/v1/?op=LISTSTATUS"
        response = requests.get(url, timeout=2)
        return response.status_code == 200
    except:
        return False

def get_local_ip():
    """Get local machine IP address"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except:
        return None

def scan_network():
    """Scan local network for HDFS servers"""
    print("🔍 Scanning local network for HDFS servers...")
    print("=" * 60)
    
    local_ip = get_local_ip()
    if not local_ip:
        print("❌ Could not determine local IP address")
        return
    
    print(f"📍 Local IP: {local_ip}")
    
    # Extract network prefix
    network_prefix = '.'.join(local_ip.split('.')[:-1])
    print(f"🌐 Scanning network: {network_prefix}.0/24")
    
    # Common HDFS ports
    hdfs_ports = [50070, 9870, 8020, 9000]
    
    found_servers = []
    
    # Scan network
    with ThreadPoolExecutor(max_workers=50) as executor:
        futures = []
        
        for i in range(1, 255):
            ip = f"{network_prefix}.{i}"
            
            # Test common HDFS ports
            for port in hdfs_ports:
                future = executor.submit(scan_port, ip, port)
                futures.append((future, ip, port))
        
        # Process results
        for future, ip, port in futures:
            try:
                if future.result():
                    print(f"🔍 Found open port {port} on {ip}")
                    
                    # Test if it's HDFS WebUI
                    if port in [50070, 9870] and test_hdfs_webui(ip, port):
                        print(f"✅ HDFS WebUI found at {ip}:{port}")
                        found_servers.append({
                            'ip': ip,
                            'port': port,
                            'type': 'webui'
                        })
                    elif port in [8020, 9000]:
                        print(f"✅ HDFS service found at {ip}:{port}")
                        found_servers.append({
                            'ip': ip,
                            'port': port,
                            'type': 'service'
                        })
                        
            except Exception as e:
                pass
    
    # Summary
    print(f"\n📊 Scan Results:")
    print("=" * 60)
    
    if found_servers:
        print(f"✅ Found {len(found_servers)} potential HDFS servers:")
        for server in found_servers:
            print(f"   📍 {server['ip']}:{server['port']} ({server['type']})")
        
        print(f"\n💡 To use a discovered server, set environment variables:")
        for server in found_servers:
            if server['type'] == 'webui':
                print(f"   export HDFS_IP={server['ip']}")
                print(f"   export WEBHDFS_PORT={server['port']}")
                break
    else:
        print("❌ No HDFS servers found on the network")
        print("\n💡 Troubleshooting:")
        print("   1. Make sure your HDFS server is running")
        print("   2. Check if the server is on the same network")
        print("   3. Verify firewall settings")
        print("   4. Try scanning a different network range")

if __name__ == "__main__":
    scan_network() 