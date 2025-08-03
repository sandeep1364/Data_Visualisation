import os
from flask import Blueprint, request, jsonify
from app.services.hdfs_utils import upload_to_hdfs
from app.config import Config

upload_bp = Blueprint('upload', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    # Upload to HDFS
    hdfs_path = f'/uploads/{file.filename}'
    hdfs_uri = f'{Config.HDFS_URI_PREFIX}{hdfs_path}'
    try:
        upload_to_hdfs(file_path, hdfs_path)
    except Exception as e:
        return jsonify({'message': f'Failed to upload to HDFS: {str(e)}'}), 500
    return jsonify({
        'message': 'File uploaded to HDFS successfully',
        'filename': file.filename,
        'hdfs_path': hdfs_path,
        'hdfs_uri': hdfs_uri
    }), 200