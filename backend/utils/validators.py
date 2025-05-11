from datetime import datetime
import re


class Validators:
    @staticmethod
    def validate_student_id(student_id):
        """Validate student ID format"""
        # Example: Student ID should be alphanumeric and 8-10 characters
        pattern = r'^[A-Za-z0-9]{8,10}'
        return bool(re.match(pattern, student_id))

    @staticmethod
    def validate_age(age):
        """Validate student age"""
        try:
            age = int(age)
            return 4 <= age <= 20  # School age range
        except (ValueError, TypeError):
            return False

    @staticmethod
    def validate_date_format(date_string):
        """Validate date format (YYYY-MM-DD)"""
        try:
            datetime.strptime(date_string, '%Y-%m-%d')
            return True
        except ValueError:
            return False

    @staticmethod
    def validate_class_name(class_name):
        """Validate class name format"""
        # Example: Class should be a number between 1-12 or Pre-K, KG
        valid_classes = ['Pre-K', 'KG'] + [str(i) for i in range(1, 13)]
        return class_name in valid_classes

    @staticmethod
    def validate_section(section):
        """Validate section format"""
        # Example: Section should be a single letter
        pattern = r'^[A-Z]'
        return bool(re.match(pattern, section.upper()))