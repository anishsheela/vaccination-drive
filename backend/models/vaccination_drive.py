from datetime import datetime
from . import db


class VaccinationDrive(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vaccine_name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    available_doses = db.Column(db.Integer, nullable=False)
    used_doses = db.Column(db.Integer, default=0)
    applicable_classes = db.Column(db.String(200))  # Comma-separated list of classes
    status = db.Column(db.String(20), default='Scheduled')  # Scheduled, Completed, Cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'vaccine_name': self.vaccine_name,
            'date': self.date.isoformat(),
            'available_doses': self.available_doses,
            'used_doses': self.used_doses,
            'applicable_classes': self.applicable_classes.split(',') if self.applicable_classes else [],
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }