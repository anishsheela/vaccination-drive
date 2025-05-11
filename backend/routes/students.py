from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import pandas as pd
import io
from models import db, Student
from sqlalchemy import or_

students_bp = Blueprint('students', __name__, url_prefix='/api/students')


@students_bp.route('', methods=['GET'])
@jwt_required()
def get_students():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = request.args.get('search', '')

    query = Student.query

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Student.name.ilike(search_term),
                Student.student_id.ilike(search_term),
                Student.class_name.ilike(search_term)
            )
        )

    pagination = query.paginate(page=page, per_page=per_page)

    return jsonify({
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page,
        'per_page': per_page,
        'students': [student.to_dict() for student in pagination.items]
    }), 200


@students_bp.route('', methods=['POST'])
@jwt_required()
def create_student():
    data = request.get_json()

    # Check if required fields are present
    required_fields = ['student_id', 'name', 'class_name', 'section']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400

    # Check if student_id already exists
    if Student.query.filter_by(student_id=data['student_id']).first():
        return jsonify({'error': 'Student ID already exists'}), 400

    student = Student(
        student_id=data['student_id'],
        name=data['name'],
        class_name=data['class_name'],
        section=data['section'],
        age=data.get('age'),
        gender=data.get('gender')
    )

    db.session.add(student)
    db.session.commit()

    return jsonify(student.to_dict()), 201


@students_bp.route('/bulk', methods=['POST'])
@jwt_required()
def bulk_import_students():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'Only CSV files are allowed'}), 400

    try:
        # Read CSV file
        df = pd.read_csv(file.stream)

        # Validate CSV structure
        required_columns = ['student_id', 'name', 'class_name', 'section']
        for column in required_columns:
            if column not in df.columns:
                return jsonify({'error': f'Missing required column: {column}'}), 400

        # Process each row
        success_count = 0
        error_count = 0
        errors = []

        for index, row in df.iterrows():
            try:
                # Check if student already exists
                if Student.query.filter_by(student_id=row['student_id']).first():
                    errors.append(f"Row {index + 1}: Student ID {row['student_id']} already exists")
                    error_count += 1
                    continue

                student = Student(
                    student_id=row['student_id'],
                    name=row['name'],
                    class_name=row['class_name'],
                    section=row['section'],
                    age=row.get('age') if 'age' in row else None,
                    gender=row.get('gender') if 'gender' in row else None
                )

                db.session.add(student)
                success_count += 1
            except Exception as e:
                errors.append(f"Row {index + 1}: {str(e)}")
                error_count += 1

        db.session.commit()

        return jsonify({
            'message': 'Bulk import completed',
            'success_count': success_count,
            'error_count': error_count,
            'errors': errors
        }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to process CSV file: {str(e)}'}), 400


@students_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_student(id):
    student = Student.query.get(id)

    if not student:
        return jsonify({'error': 'Student not found'}), 404

    return jsonify(student.to_dict()), 200


@students_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_student(id):
    student = Student.query.get(id)

    if not student:
        return jsonify({'error': 'Student not found'}), 404

    data = request.get_json()

    # Update student fields
    if 'name' in data:
        student.name = data['name']
    if 'class_name' in data:
        student.class_name = data['class_name']
    if 'section' in data:
        student.section = data['section']
    if 'age' in data:
        student.age = data['age']
    if 'gender' in data:
        student.gender = data['gender']

    db.session.commit()

    return jsonify(student.to_dict()), 200


@students_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_student(id):
    student = Student.query.get(id)

    if not student:
        return jsonify({'error': 'Student not found'}), 404

    db.session.delete(student)
    db.session.commit()

    return jsonify({'message': 'Student deleted successfully'}), 200