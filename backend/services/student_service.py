import pandas as pd
from models import db, Student
from sqlalchemy.exc import SQLAlchemyError


class StudentService:
    @staticmethod
    def validate_csv_data(df):
        """Validate CSV data structure and content"""
        required_columns = ['student_id', 'name', 'class_name', 'section']

        # Check if all required columns are present
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return False, f"Missing required columns: {', '.join(missing_columns)}"

        # Remove empty rows
        df = df.dropna(subset=required_columns)

        # Validate data types
        df['student_id'] = df['student_id'].astype(str)
        df['name'] = df['name'].astype(str)
        df['class_name'] = df['class_name'].astype(str)
        df['section'] = df['section'].astype(str)

        if 'age' in df.columns:
            df['age'] = pd.to_numeric(df['age'], errors='coerce')

        return True, df

    @staticmethod
    def process_bulk_import(csv_file):
        """Process bulk student import from CSV file"""
        try:
            # Read CSV file
            df = pd.read_csv(csv_file)

            # Validate data
            is_valid, result = StudentService.validate_csv_data(df)
            if not is_valid:
                return {'error': result}, 400

            df = result

            # Process each row
            success_count = 0
            error_count = 0
            errors = []

            for index, row in df.iterrows():
                try:
                    # Check if student already exists
                    existing_student = Student.query.filter_by(student_id=row['student_id']).first()
                    if existing_student:
                        errors.append(f"Row {index + 1}: Student ID {row['student_id']} already exists")
                        error_count += 1
                        continue

                    # Create new student
                    student = Student(
                        student_id=row['student_id'],
                        name=row['name'],
                        class_name=row['class_name'],
                        section=row['section'],
                        age=row.get('age') if pd.notna(row.get('age')) else None,
                        gender=row.get('gender') if pd.notna(row.get('gender')) else None
                    )

                    db.session.add(student)
                    success_count += 1

                except Exception as e:
                    errors.append(f"Row {index + 1}: {str(e)}")
                    error_count += 1
                    db.session.rollback()

            # Commit successful imports
            db.session.commit()

            return {
                'message': 'Bulk import completed',
                'success_count': success_count,
                'error_count': error_count,
                'errors': errors
            }, 200

        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to process CSV file: {str(e)}'}, 400