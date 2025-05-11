from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime
from models import db, Student, VaccinationDrive, VaccinationRecord

vaccinations_bp = Blueprint('vaccinations', __name__, url_prefix='/api/vaccinations')


@vaccinations_bp.route('', methods=['POST'])
@jwt_required()
def create_vaccination_record():
    data = request.get_json()

    # Check required fields
    required_fields = ['student_id', 'drive_id']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400

    # Validate student exists
    student = Student.query.get(data['student_id'])
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    # Validate drive exists
    drive = VaccinationDrive.query.get(data['drive_id'])
    if not drive:
        return jsonify({'error': 'Vaccination drive not found'}), 404

    # Check if drive has available doses
    if drive.used_doses >= drive.available_doses:
        return jsonify({'error': 'No available doses left for this drive'}), 400

    # Check if student is in applicable classes
    applicable_classes = drive.applicable_classes.split(',') if drive.applicable_classes else []
    if applicable_classes and student.class_name not in applicable_classes:
        return jsonify({'error': f'This vaccination drive is not applicable for class {student.class_name}'}), 400

    # Check if student is already vaccinated in this drive
    existing_record = VaccinationRecord.query.filter_by(
        student_id=data['student_id'],
        drive_id=data['drive_id']
    ).first()

    if existing_record:
        return jsonify({'error': 'Student already vaccinated in this drive'}), 400

    # Create vaccination record
    record = VaccinationRecord(
        student_id=data['student_id'],
        drive_id=data['drive_id'],
        date=datetime.now().date(),
        status=data.get('status', 'Completed')
    )

    # Update drive used doses
    drive.used_doses += 1

    db.session.add(record)
    db.session.commit()

    return jsonify(record.to_dict()), 201


@vaccinations_bp.route('', methods=['GET'])
@jwt_required()
def get_vaccination_records():
    student_id = request.args.get('student_id')
    drive_id = request.args.get('drive_id')

    query = VaccinationRecord.query

    if student_id:
        query = query.filter_by(student_id=student_id)

    if drive_id:
        query = query.filter_by(drive_id=drive_id)

    records = query.all()

    return jsonify([record.to_dict() for record in records]), 200


@vaccinations_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_vaccination_record(id):
    record = VaccinationRecord.query.get(id)

    if not record:
        return jsonify({'error': 'Vaccination record not found'}), 404

    # Update drive used doses
    drive = VaccinationDrive.query.get(record.drive_id)
    if drive:
        drive.used_doses = max(0, drive.used_doses - 1)

    db.session.delete(record)
    db.session.commit()

    return jsonify({'message': 'Vaccination record deleted successfully'}), 200