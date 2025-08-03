from flask import Flask
from .config import Config
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    # Import and register blueprints
    from .routes.upload_routes import upload_bp
    from .routes.analytics_routes import analytics_bp
    from .routes.auth_routes import auth_bp
    app.register_blueprint(upload_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(auth_bp)

    return app
