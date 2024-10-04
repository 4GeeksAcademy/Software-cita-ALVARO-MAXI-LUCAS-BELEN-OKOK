# models.py

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(300), nullable=False)
    last_name = db.Column(db.String(300), nullable=False)
    document_type = db.Column(db.String(200), nullable=False)
    document_number = db.Column(db.String(200), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(200), nullable=True)
    speciality = db.Column(db.String(200), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(300), nullable=False)
    phone = db.Column(db.String(20), nullable=True)

    dates = db.relationship('Date', backref='user', lazy=True, foreign_keys='Date.user_id')
    availabilities = db.relationship('WeeklyAvailability', backref='doctor', lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "last_name": self.last_name,
            "document_type": self.document_type,
            "document_number": self.document_number,
            "address": self.address,
            "role": self.role,
            "phone": self.phone,
            "speciality": self.speciality
        }

class Date(db.Model):
    __tablename__ = 'dates'
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Referencia al ID del doctor
    datetime = db.Column(db.DateTime, nullable=False)  
    reason_for_appointment = db.Column(db.String(300), nullable=False)
    date_type = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Referencia al ID del usuario (paciente)

    doctor = db.relationship('User', foreign_keys=[doctor_id], backref='appointments')  # Relación con el modelo User (doctor)

    def serialize(self):
        return {
            "id": self.id,
            "doctor": {
                "id": self.doctor.id,
                "name": self.doctor.name,
                "last_name": self.doctor.last_name,
                "speciality": self.doctor.speciality
            },
            "datetime": self.datetime.isoformat(),
            "reason_for_appointment": self.reason_for_appointment,
            "date_type": self.date_type,
            "user_id": self.user_id
        }


class WeeklyAvailability(db.Model):
    __tablename__ = 'weekly_availability'
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    day_of_week = db.Column(db.Integer, nullable=False)  # 0 = lunes, 6 = domingo
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "doctor_id": self.doctor_id,
            "day_of_week": self.day_of_week,
            "start_time": self.start_time.strftime("%H:%M"),
            "end_time": self.end_time.strftime("%H:%M")
        }
