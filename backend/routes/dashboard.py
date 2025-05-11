from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from datetime import datetime, timedelta
from models import db, Student, VaccinationDrive, VaccinationRecord

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')


@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    # Get total students
    total_students = Student.query.count()

    # Get vaccinated students (distinct)
    vaccinated_students = db.session.query(VaccinationRecord.student_id).distinct().count()

    # Get vaccination percentage
    vaccination_percentage = (vaccinated_students / total_students * 100) if total_students > 0 else 0

    # Get total vaccination drives
    total_drives = VaccinationDrive.query.count()

    # Get completed vaccination drives
    completed_drives = VaccinationDrive.query.filter_by(status='Completed').count()

    return jsonify({
        'total_students': total_students,
        'vaccinated_students': vaccinated_students,
        'vaccination_percentage': round(vaccination_percentage, 2),
        'total_drives': total_drives,
        'completed_drives': completed_drives
    }), 200


@dashboard_bp.route('/upcoming-drives', methods=['GET'])
@jwt_required()
def get_upcoming_drives():
    # Get upcoming vaccination drives (within next 30 days)
    today = datetime.now().date()
    thirty_days_later = today + timedelta(days=30)

    upcoming_drives = VaccinationDrive.query.filter(
        VaccinationDrive.date >= today,
        VaccinationDrive.date <= thirty_days_later,
        VaccinationDrive.status == 'Scheduled'
    ).order_by(VaccinationDrive.date).all()

    return jsonify([drive.to_dict() for drive in upcoming_drives]), 200