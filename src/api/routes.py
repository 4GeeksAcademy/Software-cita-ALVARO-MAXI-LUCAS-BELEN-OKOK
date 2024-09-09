"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Date, Availability
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os
from dotenv import load_dotenv
from datetime import datetime, time,date,timedelta


load_dotenv()

api = Blueprint('api', __name__)
JWTManager()

# Obtén la API Key de SendGrid desde las variables de entorno

SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
print(SENDGRID_API_KEY,"hola")

def send_email(to_email, subject, content):
    message = Mail(
        from_email='luck_caneo@hotmail.com',  
        to_emails=to_email,
        subject=subject,
        html_content=content
    )
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print("Respuesta de SendGrid:", response.status_code)
        print("Cuerpo de la respuesta:", response.body)
        print("Encabezados de la respuesta:", response.headers)
    except Exception as e:
        print("Error al enviar el correo electrónico:", e)
        print(e)


CORS(api, resources={r"/*": {"origins": "*"}})

            #RUTAS CORRESPONDIENTES A LOS USUARIOS

@api.route('/ping', methods=['GET'])
def ping():
    return "pong"

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_serialize = [user.serialize() for user in users]
    response_body = {
        "message": "These are all the users",
        "user": users_serialize
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def create_user():
    """ 
    Creamos el signup para crear usuarios.

    :return: HTTP 200
    """

    body = request.get_json()

    new_user = User(**body)

    new_user.set_password(body.get('password'))
    
    db.session.add(new_user)
    db.session.commit()

       # Enviar correo de bienvenida al nuevo usuario
    send_email(
        to_email="belengallardop@gmail.com",
        subject="Bienvenido a nuestra plataforma de oftalmologia",
        content=f"<p>Hola belen,</p><p>Gracias por registrarte en nuestra plataforma.</p>"
        
    )
    


    

    

    return jsonify({"message": "User created successfully!"}), 200


@api.route('/login' , methods=['POST'])
def login():
    body = request.get_json()
    email = body['email']
    password = body['password']

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=email)

        return jsonify({
            'access_token': access_token,
            'user': user.serialize()
        }), 200
    
    return jsonify({'error': 'Credenciales inválidas'}), 401


# Ruta para actualizar un usuario
@api.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required() 
def update_user(user_id):
    body = request.get_json()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Actualizar los campos necesarios
    user.name = body.get('name', user.name)
    user.last_name = body.get('last_name', user.last_name)
    user.document_type = body.get('document_type', user.document_type)
    user.document_number = body.get('document_number', user.document_number)
    user.address = body.get('address', user.address)
    user.role = body.get('role', user.role)
    user.speciality = body.get('speciality, user.speciality')
    user.email = body.get('email', user.email)
    user.password = body.get('password', user.password)
    user.phone = body.get('phone', user.phone)

    db.session.commit()

    return jsonify({"message": "User updated successfully"}), 200

# Ruta para eliminar un usuario
@api.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()  # Asegura que solo usuarios autenticados puedan eliminar
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200


@api.route('/private', methods=['GET'])
@jwt_required()
def private_access():
    current_user = get_jwt_identity()
    response_body = {
        "message": "access granted",
        "user": current_user
    }
    return jsonify(response_body), 200

            
            #RUTAS CORRESPONDIENTES A LAS CITAS MEDICAS

@api.route('/dates', methods=['GET'])
@jwt_required()
def get_dates():
    dates = Date.query.all()
    dates_serialize = [date.serialize() for date in dates]
    return jsonify(dates_serialize), 200


@api.route('/dates/<int:date_id>', methods=['GET'])
@jwt_required()
def get_date(date_id):
    date = Date.query.get(date_id)
    if not date:
        return jsonify({"message": "Date not found"}), 404
    return jsonify(date.serialize()), 200


@api.route('/dates', methods=['POST'])
@jwt_required()
def create_date():
    body = request.get_json()
    
    # Verificar disponibilidad
    appointment_date = datetime.strptime(body['datetime'], "%Y-%m-%dT%H:%M:%S")
    availability = Availability.query.filter_by(
        doctor_id=body['doctor_id'],
        date=appointment_date.date(),
        is_available=True
    ).first()

    if availability and availability.start_time <= appointment_date.time() <= availability.end_time:
        # Crear la cita
        new_date = Date(
            speciality=body['speciality'],
            doctor=body['doctor_id'],
            datetime=appointment_date,
            reason_for_appointment=body['reason_for_appointment'],
            date_type=body['date_type'],
            user_id=body['user_id']
        )
        
        # Marcar la disponibilidad como no disponible
        availability.is_available = False
        db.session.add(new_date)
        db.session.commit()
        
        return jsonify({"message": "Date created successfully", "date": new_date.serialize()}), 201
    else:
        return jsonify({"message": "The selected time is not available"}), 400



@api.route('/dates/<int:date_id>', methods=['PUT'])
@jwt_required()
def update_date(date_id):
    body = request.get_json()
    date = Date.query.get(date_id)
    
    if not date:
        return jsonify({"message": "Date not found"}), 404
    
    date.speciality = body.get('speciality', date.speciality)
    date.doctor = body.get('doctor', date.doctor)
    date.datetime = body.get('datetime', date.datetime)
    date.reason_for_appointment = body.get('reason_for_appointment', date.reason_for_appointment)
    date.date_type = body.get('date_type', date.date_type)
    date.user_id = body.get('user_id', date.user_id)
    
    db.session.commit()
    
    return jsonify({"message": "Date updated successfully", "date": date.serialize()}), 200


@api.route('/dates/<int:date_id>', methods=['DELETE'])
@jwt_required()
def delete_date(date_id):
    date = Date.query.get(date_id)
    
    if not date:
        return jsonify({"message": "Date not found"}), 404
    
    db.session.delete(date)
    db.session.commit()
    
    return jsonify({"message": "Date deleted successfully"}), 200


# Citas que pertenecen al usuario
@api.route('/private/dates', methods=['GET'])
@jwt_required()
def get_private_dates():
    current_user_id = get_jwt_identity()

    dates = Date.query.filter_by(user_id=current_user_id).all()

    dates_serialize = [date.serialize() for date in dates]

    return jsonify({
        "message": "Your next appointments",
        "dates": dates_serialize
    }), 200


#crear doctor
@api.route('/doctors', methods=['POST'])
@jwt_required()
def create_doctor():
    body = request.get_json()
    
    new_doctor = User(**body)
    new_doctor.set_password(body.get('password', 'default_password'))
    new_doctor.role = 'doctor'  # Asegúrate de que el rol sea 'doctor'
    
    db.session.add(new_doctor)
    db.session.commit()
    
    return jsonify({"message": "Doctor created successfully!", "doctor": new_doctor.serialize()}), 201


@api.route('/doctors', methods=['GET'])
@jwt_required()
def get_doctors():
    doctors = User.query.filter_by(role='doctor').all()  # Asumiendo que el rol de doctor es 'doctor'
    doctors_serialize = [doctor.serialize() for doctor in doctors]
    return jsonify(doctors_serialize), 200


@api.route('/doctor/<int:doctor_id>/availability', methods=['GET'])
@jwt_required()
def get_doctor_availability(doctor_id):
    date_str = request.args.get('date')
    date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
    
    # Filtrar las citas que ya están reservadas para ese doctor en esa fecha
    appointments = Date.query.filter_by(doctor=doctor_id, datetime=date_obj).all()
    reserved_times = [appointment.datetime.time() for appointment in appointments]
    
    # Asumimos que el doctor trabaja de 9:00 AM a 5:00 PM, y tiene citas cada 30 minutos
    available_times = []
    start_time = datetime.strptime("09:00", "%H:%M").time()
    end_time = datetime.strptime("17:00", "%H:%M").time()

    current_time = start_time
    while current_time < end_time:
        if current_time not in reserved_times:
            available_times.append(current_time.strftime('%H:%M'))
        current_time = (datetime.combine(date.today(), current_time) + timedelta(minutes=30)).time()

    return jsonify(available_times), 200

@api.route('/availability', methods=['GET'])
def get_availability():
    availabilities = Availability.query.all()
    availabilities_serialize = [availability.serialize() for availability in availabilities]
    return jsonify(availabilities_serialize), 200

@api.route('/availability', methods=['POST'])
def create_availability():
    body = request.get_json()
    
    new_availability = Availability(
        doctor_id=body['doctor_id'],
        date=datetime.strptime(body['date'], "%Y-%m-%d").date(),
        start_time=datetime.strptime(body['start_time'], "%H:%M").time(),
        end_time=datetime.strptime(body['end_time'], "%H:%M").time(),
        is_available=body.get('is_available', True)
    )
    
    db.session.add(new_availability)
    db.session.commit()
    
    return jsonify(new_availability.serialize()), 201
