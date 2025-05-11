from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .student import Student
from .vaccination_drive import VaccinationDrive
from .vaccination_record import VaccinationRecord
from .user import User