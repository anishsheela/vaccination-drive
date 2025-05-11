from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required
import pandas as pd
import io
from datetime import datetime
from models import db, Student, VaccinationDrive, VaccinationRecord
from sqlalchemy.orm import joinedload

reports_bp = Blueprint('reports', __name__, url_prefix='/api/reports')


@reports_bp.route('/vaccinations', methods=['GET'])
@jwt_required()
def get_vaccination_report():
    # Parse filters
    vaccine_name = request.args.get('vaccine_name')
    class_name = request.args.get('class_name')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    download = request.args.get('download', '').lower() == 'true'

    # Base query
    query = db.session.query(
        VaccinationRecord, Student, VaccinationDrive
    ).join(
        Student, VaccinationRecord.student_id == Student.id
    ).join(
        VaccinationDrive, VaccinationRecord.drive_id == VaccinationDrive.id
    )

    # Apply filters
    if vaccine_name:
        query = query.filter(VaccinationDrive.vaccine_name == vaccine_name)

    if class_name:
        query = query.filter(Student.class_name == class_name)

    if start_date:
        try:
            start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
            query = query.filter(VaccinationRecord.date >= start_date_obj)
        except ValueError:
            pass

    if end_date:
        try:
            end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
            query = query.filter(VaccinationRecord.date <= end_date_obj)
        except ValueError:
            pass

    # Execute query
    results = query.order_by(VaccinationRecord.date.desc()).all()

    # Format results
    records = []
    for record, student, drive in results:
        records.append({
            'record_id': record.id,
            'student_id': student.student_id,
            'student_name': student.name,
            'class_name': student.class_name,
            'section': student.section,
            'vaccine_name': drive.vaccine_name,
            'vaccination_date': record.date.isoformat(),
            'status': record.status
        })

    # If download requested, return CSV file
    if download:
        if not records:
            return jsonify({'error': 'No records found'}), 404

        df = pd.DataFrame(records)
        output = io.StringIO()
        df.to_csv(output, index=False)

        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={
                'Content-Disposition': 'attachment;filename=vaccination_report.csv'
            }
        )

    # Otherwise return JSON
    return jsonify({
        'count': len(records),
        'records': records
    }), 200


@reports_bp.route('/vaccines', methods=['GET'])
@jwt_required()
def get_vaccines_list():
    # Get distinct vaccine names
    vaccines = db.session.query(VaccinationDrive.vaccine_name).distinct().all()

    return jsonify([vaccine[0] for vaccine in vaccines]), 200


@reports_bp.route('/classes', methods=['GET'])
@jwt_required()
def get_classes_list():
    # Get distinct class names
    classes = db.session.query(Student.class_name).distinct().all()

    return jsonify([cls[0] for cls in classes]), 200