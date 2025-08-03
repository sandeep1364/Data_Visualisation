# IntelliView - Data Visualization Dashboard

A modern, feature-rich data visualization platform built with React and Material-UI.

## 🚀 Features

### 📊 **Advanced Data Analytics**
- **Comprehensive Data Analysis**: Automatic schema detection, statistical summaries, and data quality assessment
- **Interactive Data Tables**: Sort, filter, search, and paginate through your data
- **Real-time Insights**: Get instant feedback on data quality and patterns

### 📈 **Rich Chart Builder**
- **Multiple Chart Types**: Bar, Line, Scatter, Pie, Histogram, Box Plot, Heatmap, Area charts
- **Advanced Customization**: Color palettes, opacity controls, grid settings, legends
- **Interactive Charts**: Zoom, pan, hover tooltips, and responsive design
- **Export Options**: Download charts as images or share them

### 🔧 **Modern User Interface**
- **Sidebar Navigation**: Easy access to all features with intuitive icons
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Live system status and performance monitoring

### 📁 **Smart File Management**
- **Drag & Drop Upload**: Intuitive file upload with visual feedback
- **Multiple Formats**: Support for CSV, JSON, and Parquet files
- **File Validation**: Automatic file type and size validation
- **Progress Tracking**: Real-time upload progress with detailed status

### ⚙️ **System Monitoring**
- **HDFS Status**: Real-time connection monitoring and health checks
- **Spark Cluster**: Monitor active jobs, executors, and memory usage
- **Performance Metrics**: CPU, memory, and network latency tracking
- **Automatic Recovery**: Dynamic IP discovery and connection management

### 🛠️ **Comprehensive Settings**
- **Appearance**: Theme, language, font size customization
- **Notifications**: Email, push, and sound alert configuration
- **Performance**: Auto-refresh, file size limits, compression settings
- **Security**: Session timeout, authentication, data encryption
- **Data Management**: Retention policies, backup settings, chart defaults

## 🏗️ Architecture

### **Component Structure**
```
src/
├── components/
│   ├── Dashboard.jsx          # Main dashboard with sidebar navigation
│   ├── DataAnalytics.jsx      # Comprehensive data analysis
│   ├── ChartBuilder.jsx       # Advanced chart creation
│   ├── DataTable.jsx          # Interactive data table
│   ├── SystemStatus.jsx       # System monitoring
│   ├── SettingsPanel.jsx      # Application settings
│   └── FileUpload.jsx         # Enhanced file upload
├── App.jsx                    # Main application component
└── index.css                  # Global styles
```

### **Key Technologies**
- **React 19**: Latest React with hooks and modern patterns
- **Material-UI 7**: Professional UI components and theming
- **Plotly.js**: Interactive charts and visualizations
- **Axios**: HTTP client for API communication
- **React Dropzone**: Advanced file upload handling

## 🎨 Design System

### **Color Palette**
- **Primary**: Blue (#1976d2) - Main actions and navigation
- **Secondary**: Pink (#d81b60) - Accent elements
- **Success**: Green (#388e3c) - Positive states
- **Warning**: Yellow (#fbc02d) - Caution states
- **Error**: Red (#ff5722) - Error states

### **Typography**
- **Headings**: Roboto font family with proper hierarchy
- **Body**: Clean, readable text with appropriate line heights
- **Code**: Monospace font for technical content

### **Spacing**
- **Consistent Grid**: 8px base unit system
- **Responsive Margins**: Adaptive spacing for different screen sizes
- **Card Layouts**: Proper padding and elevation for content hierarchy

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: < 600px - Single column layout
- **Tablet**: 600px - 960px - Two column layout
- **Desktop**: > 960px - Full sidebar with main content

### **Mobile Optimizations**
- **Touch-friendly**: Large touch targets and gestures
- **Simplified Navigation**: Collapsible sidebar for mobile
- **Optimized Charts**: Responsive chart sizing and controls

## 🔧 Configuration

### **Environment Variables**
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_HDFS_URL=http://your-hdfs-server:50070

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_CHARTS=true
REACT_APP_ENABLE_SYSTEM_MONITORING=true
```

### **Local Storage**
The application uses localStorage for:
- User preferences and settings
- Saved chart configurations
- Recent file uploads
- Theme preferences

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### **Development Commands**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📊 Usage Guide

### **1. Upload Data**
1. Navigate to "Data Upload" in the sidebar
2. Drag and drop your CSV, JSON, or Parquet file
3. Review file details and click "Upload"
4. Monitor upload progress

### **2. Analyze Data**
1. Go to "Analytics" tab after upload
2. Click "Analyze Data" to start analysis
3. Review schema, sample data, and statistics
4. Check data quality scores and insights

### **3. Create Visualizations**
1. Navigate to "Visualizations" tab
2. Select chart type and data columns
3. Customize colors, titles, and settings
4. Preview and save your chart

### **4. Explore Data**
1. Use "Data Table" for detailed data exploration
2. Search, filter, and sort your data
3. Export filtered results as CSV
4. Navigate through pages of data

### **5. Monitor System**
1. Check "System Status" for health metrics
2. Monitor HDFS and Spark connections
3. View performance indicators
4. Set up alerts for issues

## 🎯 Best Practices

### **Data Preparation**
- **Clean Data**: Remove duplicates and handle missing values
- **Consistent Format**: Use standard date and number formats
- **Reasonable Size**: Keep files under 2GB for optimal performance
- **Proper Encoding**: Use UTF-8 encoding for text data

### **Chart Creation**
- **Choose Wisely**: Select chart types that best represent your data
- **Color Carefully**: Use accessible color combinations
- **Label Clearly**: Provide descriptive titles and axis labels
- **Keep Simple**: Avoid cluttering charts with too much information

### **Performance**
- **Monitor Resources**: Check system status regularly
- **Optimize Queries**: Use appropriate filters and limits
- **Cache Results**: Save frequently used analyses
- **Update Regularly**: Keep the application updated

## 🔒 Security Features

### **Data Protection**
- **Encryption**: Optional data encryption for sensitive information
- **Authentication**: Session-based authentication system
- **Authorization**: Role-based access control
- **Audit Logs**: Track user actions and data access

### **Network Security**
- **HTTPS**: Secure communication with backend
- **CORS**: Proper cross-origin resource sharing
- **Input Validation**: Client-side and server-side validation
- **File Scanning**: Virus scanning for uploaded files

## 🐛 Troubleshooting

### **Common Issues**

**Upload Fails**
- Check file size (max 2GB)
- Verify file format (CSV, JSON, Parquet)
- Ensure stable internet connection
- Check backend server status

**Charts Not Loading**
- Verify data analysis is complete
- Check browser console for errors
- Ensure sufficient memory available
- Try refreshing the page

**System Status Errors**
- Check HDFS server connectivity
- Verify Spark cluster status
- Review network configuration
- Check firewall settings

### **Performance Issues**
- **Slow Loading**: Check network connection and server status
- **Memory Issues**: Close unused tabs and clear browser cache
- **Chart Rendering**: Reduce data points or use sampling
- **Upload Problems**: Check file size and network stability

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### **Code Standards**
- **ESLint**: Follow the configured linting rules
- **Prettier**: Use consistent code formatting
- **TypeScript**: Consider adding type safety
- **Testing**: Write unit and integration tests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Material-UI**: For the excellent component library
- **Plotly.js**: For powerful charting capabilities
- **React Community**: For the amazing ecosystem
- **Data Science Community**: For inspiration and best practices

## 📞 Support

For support and questions:
- **Documentation**: Check this README and inline comments
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team

---

**IntelliView** - Making data visualization intelligent and accessible! 🚀
