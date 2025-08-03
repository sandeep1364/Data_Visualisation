@echo off
echo ========================================
echo HDFS Connection Test Tool
echo ========================================
echo.

echo Testing HDFS connection with dynamic IP discovery...
python test_hdfs_discovery.py

echo.
echo ========================================
echo Network Scanner (optional)
echo ========================================
echo.
set /p scan="Do you want to scan the network for HDFS servers? (y/n): "
if /i "%scan%"=="y" (
    echo Scanning network for HDFS servers...
    python network_scanner.py
)

echo.
echo ========================================
echo Environment Variables
echo ========================================
echo.
echo To manually set HDFS connection, use these environment variables:
echo.
echo set HDFS_HOSTNAME=your-server-hostname
echo set HDFS_IP=your-server-ip
echo set WEBHDFS_PORT=50070
echo set HDFS_PORT=8020
echo set HDFS_USER=cloudera
echo.
pause 