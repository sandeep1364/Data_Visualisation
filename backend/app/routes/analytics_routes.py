from flask import Blueprint, request, jsonify
from app.services.simple_analyzer import analyze_hdfs_file_simple
import logging

# Set up logging
logger = logging.getLogger(__name__)

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analyze/preview', methods=['POST'])
def analyze_preview():
    """Analyze HDFS file and return preview data"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        hdfs_path = data.get('hdfs_path')
        if not hdfs_path:
            return jsonify({"error": "Missing hdfs_path"}), 400
            
        logger.info(f"Received analysis request for HDFS path: {hdfs_path}")
        
        result = analyze_hdfs_file_simple(hdfs_path)
        logger.info("Analysis completed successfully")
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_preview: {str(e)}")
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500

@analytics_bp.route('/summary', methods=['GET'])
def summary():
    """Get summary for a specific file"""
    try:
        filename = request.args.get('filename')
        if not filename:
            return jsonify({"error": "Missing filename"}), 400
            
        # Construct HDFS path (same as upload logic)
        hdfs_path = f'/uploads/{filename}'
        logger.info(f"Received summary request for file: {filename}, HDFS path: {hdfs_path}")
        
        result = analyze_hdfs_file_simple(hdfs_path)
        logger.info("Summary analysis completed successfully")
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in summary: {str(e)}")
        return jsonify({"error": f"Summary failed: {str(e)}"}), 500
