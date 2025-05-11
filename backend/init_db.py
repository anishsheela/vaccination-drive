from app import create_app
from models import db, User, Student, VaccinationDrive
from datetime import datetime, timedelta


def init_database():
    app = create_app()

    with app.app_context():
        # Create all tables
        db.create_all()

        # Create default admin user
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(
                username='admin',
                role='coordinator',
                name='School Coordinator'
            )
            admin.set_password('admin123')
            db.session.add(admin)

        # Add sample students
        sample_students = [
            {'student_id': 'ST001', 'name': 'John Doe', 'class_name': '5', 'section': 'A', 'age': 10, 'gender': 'Male'},
            {'student_id': 'ST002', 'name': 'Jane Smith', 'class_name': '5', 'section': 'B', 'age': 10,
             'gender': 'Female'},
            {'student_id': 'ST003', 'name': 'Robert Johnson', 'class_name': '6', 'section': 'A', 'age': 11,
             'gender': 'Male'},
            {'student_id': 'ST004', 'name': 'Emily Davis', 'class_name': '6', 'section': 'B', 'age': 11,
             'gender': 'Female'},
            {'student_id': 'ST005', 'name': 'Michael Wilson', 'class_name': '7', 'section': 'A', 'age': 12,
             'gender': 'Male'},
        ]

        for student_data in sample_students:
            student = Student.query.filter_by(student_id=student_data['student_id']).first()
            if not student:
                student = Student(**student_data)
                db.session.add(student)

        # Add sample vaccination drives
        today = datetime.now().date()
        sample_drives = [
            {
                'vaccine_name': 'HPV Vaccine',
                'date': today + timedelta(days=20),
                'available_doses': 100,
                'applicable_classes': '5,6,7',
                'status': 'Scheduled'
            },
            {
                'vaccine_name': 'Flu Vaccine',
                'date': today + timedelta(days=30),
                'available_doses': 150,
                'applicable_classes': '1,2,3,4,5,6,7,8,9,10,11,12',
                'status': 'Scheduled'
            },
        ]

        for drive_data in sample_drives:
            drive = VaccinationDrive.query.filter_by(
                vaccine_name=drive_data['vaccine_name'],
                date=drive_data['date']
            ).first()
            if not drive:
                drive = VaccinationDrive(**drive_data)
                db.session.add(drive)

        db.session.commit()
        print("Database initialized successfully!")


if __name__ == '__main__':
    init_database()