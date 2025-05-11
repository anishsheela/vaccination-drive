from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime, timedelta
from models import db, VaccinationDrive

drives_bp = Blueprint('drives', __name__, url_prefix='/api/drives')


@drives_bp.route('', methods=['GET'])
@jwt_required()
def get_drives():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status = request.args.get('status')

    query = VaccinationDrive.query

    if status:
        query = query.filter_by(status=status)

    pagination = query.order_by(VaccinationDrive.date.desc()).paginate(page=page, per_page=per_page)

    return jsonify({
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page,
        'per_page': per_page,
        'drives': [drive.to_dict() for drive in pagination.items]
    }), 200


@drives_bp.route('', methods=['POST'])
@jwt_required()
def create_drive():
    data = request.get_json()

    # Check if required fields are present
    required_fields = ['vaccine_name', 'date', 'available_doses', 'applicable_classes']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400

    # Convert date string to date object
    try:
        drive_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    # Check if drive date is at least 15 days in the future
    today = datetime.now().date()
    if drive_date < today + timedelta(days=15):
        return jsonify({'error': 'Vaccination drive must be scheduled at least 15 days in advance'}), 400

    # Check for overlapping drives on the same date
    existing_drive = VaccinationDrive.query.filter_by(date=drive_date).first()
    if existing_drive:
        return jsonify({'error': 'A vaccination drive is already scheduled for this date'}), 400

    # Create vaccination drive
    drive = VaccinationDrive(
        vaccine_name=data['vaccine_name'],
        date=drive_date,
        available_doses=data['available_doses'],
        applicable_classes=','.join(data['applicable_classes']) if isinstance(data['applicable_classes'], list) else
        data['applicable_classes'],
        status='Scheduled'
    )

    db.session.add(drive)
    db.session.commit()

    return jsonify(drive.to_dict()), 201


@drives_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_drive(id):
    drive = VaccinationDrive.query.get(id)

    if not drive:
        return jsonify({'error': 'Vaccination drive not found'}), 404

    return jsonify(drive.to_dict()), 200


@drives_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_drive(id):
    drive = VaccinationDrive.query.get(id)

    if not drive:
        return jsonify({'error': 'Vaccination drive not found'}), 404

    # Check if drive is in the past
    today = datetime.now().date()
    if drive.date < today:
        return jsonify({'error': 'Cannot edit past vaccination drives'}), 400

    data = request.get_json()

    # Update drive fields
    if 'vaccine_name' in data:
        drive.vaccine_name = data['vaccine_name']

    if 'date' in data:
        try:
            new_date = datetime.strptime(data['date'], '%Y-%m-%d').date()

            # Check if new date is at least 15 days in the future
            if new_date < today + timedelta(days=15):
                return jsonify({'error': 'Vaccination drive must be scheduled at least 15 days in advance'}), 400

            # Check for overlapping drives on the new date (excluding current drive)
            existing_drive = VaccinationDrive.query.filter(
                VaccinationDrive.date == new_date,
                VaccinationDrive.id != id
            ).first()

            if existing_drive:
                return jsonify({'error': 'A vaccination drive is already scheduled for this date'}), 400

            drive.date = new_date
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    if 'available_doses' in data:
        drive.available_doses = data['available_doses']

    if 'applicable_classes' in data:
        drive.applicable_classes = ','.join(data['applicable_classes']) if isinstance(data['applicable_classes'],
                                                                                      list) else data[
            'applicable_classes']

    if 'status' in data:
        drive.status = data['status']

    db.session.commit()

    return jsonify(drive.to_dict()), 200


@drives_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_drive(id):
    drive = VaccinationDrive.query.get(id)

    if not drive:
        return jsonify({'error': 'Vaccination drive not found'}), 404

    # Check if drive is in the past
    today = datetime.now().date()
    if drive.date < today:
        return jsonify({'error': 'Cannot delete past vaccination drives'}), 400

    db.session.delete(drive)
    db.session.commit()

    return jsonify({'message': 'Vaccination drive deleted successfully'}), 200