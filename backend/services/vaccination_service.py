from datetime import datetime, timedelta
from models import db, VaccinationDrive, VaccinationRecord, Student
from sqlalchemy.exc import SQLAlchemyError


class VaccinationService:
    @staticmethod
    def validate_drive_date(date, exclude_drive_id=None):
        """Validate vaccination drive date"""
        today = datetime.now().date()

        # Check if date is at least 15 days in the future
        if date < today + timedelta(days=15):
            return False, "Vaccination drive must be scheduled at least 15 days in advance"

        # Check for overlapping drives
        query = VaccinationDrive.query.filter_by(date=date)
        if exclude_drive_id:
            query = query.filter(VaccinationDrive.id != exclude_drive_id)

        existing_drive = query.first()
        if existing_drive:
            return False, "A vaccination drive is already scheduled for this date"

        return True, ""

    @staticmethod
    def validate_vaccination_record(student_id, drive_id):
        """Validate if a vaccination record can be created"""
        # Check if student exists
        student = Student.query.get(student_id)
        if not student:
            return False, "Student not found"

        # Check if drive exists
        drive = VaccinationDrive.query.get(drive_id)
        if not drive:
            return False, "Vaccination drive not found"

        # Check if drive has available doses
        if drive.used_doses >= drive.available_doses:
            return False, "No available doses left for this drive"

        # Check if student is in applicable classes
        applicable_classes = drive.applicable_classes.split(',') if drive.applicable_classes else []
        if applicable_classes and student.class_name not in applicable_classes:
            return False, f"This vaccination drive is not applicable for class {student.class_name}"

        # Check if student is already vaccinated in this drive
        existing_record = VaccinationRecord.query.filter_by(
            student_id=student_id,
            drive_id=drive_id
        ).first()

        if existing_record:
            return False, "Student already vaccinated in this drive"

        return True, {"student": student, "drive": drive}

    @staticmethod
    def update_drive_status(drive_id=None):
        """Update vaccination drive status based on date"""
        today = datetime.now().date()

        if drive_id:
            drives = [VaccinationDrive.query.get(drive_id)]
        else:
            drives = VaccinationDrive.query.filter(
                VaccinationDrive.status != 'Cancelled'
            ).all()

        for drive in drives:
            if drive:
                if drive.date < today and drive.status == 'Scheduled':
                    drive.status = 'Completed'
                elif drive.date > today and drive.status == 'Completed':
                    drive.status = 'Scheduled'

        db.session.commit()