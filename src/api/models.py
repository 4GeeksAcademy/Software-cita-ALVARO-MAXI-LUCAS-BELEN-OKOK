from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), nullable=False)
    last_name = db.Column(db.String(300), nullable=False)
    document_type = db.Column(db.String(200), nullable=False)
    document_number = db.Column(db.String(200), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)

    # Relación uno a muchos: un usuario puede tener múltiples citas
    dates = db.relationship('Date', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

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
        }

class Date(db.Model):
    __tablename__ = 'dates'
    id = db.Column(db.Integer, primary_key=True)
    speciality = db.Column(db.String(50), nullable=False)
    doctor = db.Column(db.String(100), nullable=False)
    datetime = db.Column(db.DateTime, nullable=False)  
    reason_for_appointment = db.Column(db.String(300), nullable=False)
    date_type = db.Column(db.String(100), nullable=False)
    
    # Relación muchos a uno: muchas citas pueden pertenecer a un usuario
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __repr__(self):
        return f'<Date {self.datetime} - Doctor {self.doctor}>'

    def serialize(self):
        return {
            "id": self.id,
            "speciality": self.speciality,
            "doctor": self.doctor,
            "datetime": self.datetime.isoformat(),
            "reason_for_appointment": self.reason_for_appointment,
            "date_type": self.date_type,
            "user_id": self.user_id
        }
