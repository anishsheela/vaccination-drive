from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
import routes


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    CORS(app)
    JWTManager(app)

    # Register blueprints
    app.register_blueprint(routes.auth_bp)
    app.register_blueprint(routes.dashboard_bp)
    app.register_blueprint(routes.students_bp)
    app.register_blueprint(routes.drives_bp)
    app.register_blueprint(routes.vaccinations_bp)
    app.register_blueprint(routes.reports_bp)

    # Create database tables
    with app.app_context():
        db.create_all()
        # Create default admin user if not exists
        from models.user import User
        if not User.query.filter_by(username='admin').first():
            admin = User(username='admin', role='coordinator', name='School Coordinator')
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)