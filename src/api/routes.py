from datetime import date, timedelta, datetime
from flask import request, jsonify, Blueprint
from api.models import db, User, Date, WeeklyAvailability
from api.utils import APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
import os
from dotenv import load_dotenv
from sqlalchemy.exc import SQLAlchemyError
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


import resend

# Cargar variables de entorno
load_dotenv()

# Configurar API Key de Resend
resend.api_key = os.getenv("RESEND_API_KEY")

# Crear Blueprint para la API
api = Blueprint('api', __name__)

# Configuración de JWTManager
JWTManager()

# Configuración de CORS
CORS(api, resources={r"/*": {"origins": "*"}})

# Ruta de ejemplo para verificar que el servidor esté corriendo
@api.route('/ping', methods=['GET'])
def ping():
    return "pong"

# Ruta para obtener todos los usuarios
@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_serialize = [user.serialize() for user in users]
    response_body = {
        "message": "These are all the users",
        "user": users_serialize
    }
    return jsonify(response_body), 200

# Ruta para crear un nuevo usuario
@api.route('/signup', methods=['POST'])
def create_user():
    body = request.get_json()
    new_user = User(**body)
    new_user.set_password(body.get('password'))
    db.session.add(new_user)
    db.session.commit()

    # Configurar los detalles del correo electrónico de bienvenida
    sender_email = os.getenv("SENDGRID_VERIFIED_EMAIL", "luck_caneo@hotmail.com")  # Tu correo verificado
    recipient_email = new_user.email  # El correo del usuario recién registrado
    message = Mail(
        from_email=sender_email,
        to_emails=recipient_email,
        subject="Welcome to Our Platform!",
        html_content="<strong>Welcome to our platform, we're glad to have you!</strong>"
    )

    try:
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))  # Utiliza tu API Key de SendGrid
        response = sg.send(message)
        print(f"Email sent successfully: {response.status_code}")
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({"message": "User created, but there was an error sending the email"}), 500

    return jsonify({"message": "User created successfully!"}), 200


@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    email = body['email']
    password = body['password']

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        # Cambia la identidad a user.id en lugar de email
        access_token = create_access_token(identity=user.id)

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
    user.speciality = body.get('speciality', user.speciality)         #SE MODIFICÓ ERROR EN COMILLAS.
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
    try:
        dates = Date.query.all()
        dates_serialize = [date.serialize() for date in dates]
        return jsonify(dates_serialize), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error al obtener fechas"}), 500


@api.route('/dates/<int:date_id>', methods=['GET'])
@jwt_required()
def get_date(date_id):
    date = Date.query.get(date_id)
    if not date:
        return jsonify({"message": "Date not found"}), 404
    return jsonify(date.serialize()), 200




def send_appointment_email(appointment):
    sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
    sender_email = os.getenv("SENDGRID_VERIFIED_EMAIL", "luck_caneo@hotmail.com")

    if not sendgrid_api_key:
        print("SendGrid API Key is missing")
        return
    
    if not sender_email:
        print("Sender email is missing or not verified in SendGrid")
        return

    # Obtener la información del usuario y del doctor
    user = User.query.get(appointment.user_id)
    doctor = User.query.get(int(appointment.doctor))

    if not user or not doctor:
        print("User or Doctor information is missing")
        return

    # Crear el contenido del correo
    email_content = f"""
    <h2>Confirmación de Cita Médica</h2>
    <p>Estimado/a {user.name},</p>
    <p>Su cita médica ha sido confirmada con los siguientes detalles:</p>
    <ul>
        <li><strong>Doctor:</strong> {doctor.name}</li>
        <li><strong>Especialidad:</strong> {doctor.speciality}</li>
        <li><strong>Fecha y Hora:</strong> {appointment.datetime.strftime('%Y-%m-%d %H:%M')}</li>
        <li><strong>Razón de la Cita:</strong> {appointment.reason_for_appointment}</li>
    </ul>
    <p>Gracias por confiar en nosotros.</p>
    """

    # Crear el mensaje de correo
    message = Mail(
        from_email=sender_email,
        to_emails=user.email,
        subject="Confirmación de Cita Médica",
        html_content=email_content
    )

    try:
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        print(f"Correo enviado con estado: {response.status_code}")
        if response.status_code != 202:
            print(f"Error al enviar correo: {response.body}")
    except Exception as e:
        print(f"Error al enviar el correo con SendGrid: {e}")



@api.route('/dates', methods=['POST'])
@jwt_required()
def create_date():
    body = request.get_json()

    try:
        # Convertir la fecha y hora a formato datetime esperado
        appointment_datetime = datetime.strptime(body['datetime'], "%Y-%m-%dT%H:%M:%S.%fZ")
    except ValueError:
        try:
            appointment_datetime = datetime.strptime(body['datetime'], "%Y-%m-%dT%H:%M:%SZ")
        except ValueError:
            return jsonify({"message": "Formato de fecha/hora inválido"}), 400

    day_of_week = appointment_datetime.weekday()
    weekly_availability = WeeklyAvailability.query.filter_by(
        doctor_id=body['doctor_id'],
        day_of_week=day_of_week
    ).first()

    if not weekly_availability:
        return jsonify({"message": "El doctor no tiene disponibilidad en ese día de la semana"}), 400

    if not (weekly_availability.start_time <= appointment_datetime.time() <= weekly_availability.end_time):
        return jsonify({"message": "La hora seleccionada no está disponible"}), 400

    existing_appointment = Date.query.filter_by(
        doctor=body['doctor_id'],
        datetime=appointment_datetime
    ).first()

    if existing_appointment:
        return jsonify({"message": "Esta hora ya está reservada para otra cita"}), 400

    new_date = Date(
        doctor=body['doctor_id'],
        datetime=appointment_datetime,
        reason_for_appointment=body['reason_for_appointment'],
        date_type=body['date_type'],
        user_id=body['user_id'],
    )

    db.session.add(new_date)
    db.session.commit()

    try:
        send_appointment_email(new_date)  # Llama a la función para enviar el correo de confirmación
    except Exception as e:
        print(f"Error sending appointment email: {e}")
        return jsonify({"message": "Cita creada, pero hubo un error al enviar el correo"}), 500

    return jsonify({"message": "Cita creada exitosamente", "date": new_date.serialize()}), 201






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
    current_user_id = get_jwt_identity()  # Esto ahora será el user_id directamente
    dates = Date.query.filter_by(user_id=current_user_id).all()

    dates_serialize = [date.serialize() for date in dates]

    return jsonify({
        "message": "Your next appointments",
        "dates": dates_serialize
    }), 200



@api.route('/doctors', methods=['POST'])
@jwt_required()
def create_doctor():
    body = request.get_json()

    # Validar campos requeridos
    required_fields = ['name', 'email', 'password', 'speciality', 'document_type']
    for field in required_fields:
        if not body.get(field):
            return jsonify({"error": f"'{field}' is required"}), 400

    try:
        # Crear nuevo doctor
        new_doctor = User(
            name=body.get('name'),
            last_name=body.get('last_name'),
            document_type=body.get('document_type'),
            document_number=body.get('document_number'),
            address=body.get('address'),
            role='doctor',  # Asignamos el rol de doctor
            speciality=body.get('speciality'),
            email=body.get('email'),
           phone=body.get('phone', '') 
        )
        new_doctor.set_password(body.get('password'))

        db.session.add(new_doctor)
        db.session.commit()

        return jsonify({"message": "Doctor created successfully!", "doctor": new_doctor.serialize()}), 201
    except SQLAlchemyError as e:
        # Manejar cualquier error de la base de datos
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


#Eliminar Doctor
@api.route('/doctors/<int:doctor_id>', methods=['DELETE'])
@jwt_required()
def delete_doctor(doctor_id):
    doctor = User.query.get(doctor_id)
    
    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404

    db.session.delete(doctor)
    db.session.commit()
    
    return jsonify({"message": "Doctor deleted successfully"}), 200

#Actualizar Doctor
@api.route('/doctors/<int:doctor_id>', methods=['PUT'])
@jwt_required()
def update_doctor(doctor_id):
    body = request.get_json()
    doctor = User.query.get(doctor_id)
    
    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404

    doctor.name = body.get('name', doctor.name)
    doctor.last_name = body.get('last_name', doctor.last_name)
    doctor.speciality = body.get('speciality', doctor.speciality)
    doctor.email = body.get('email', doctor.email)
    doctor.phone = body.get('phone', doctor.phone)

    db.session.commit()
    
    return jsonify({"message": "Doctor updated successfully", "doctor": doctor.serialize()}), 200
#Obtener doctor
@api.route('/doctors', methods=['GET'])
@jwt_required()
def get_doctors():
    doctors = User.query.filter_by(role='doctor').all()  # Asumiendo que el rol de doctor es 'doctor'
    doctors_serialize = [doctor.serialize() for doctor in doctors]
    return jsonify(doctors_serialize), 200


@api.route('/doctor/<int:doctor_id>/availability', methods=['GET'])
@jwt_required()
def get_weekly_availability(doctor_id):
    availabilities = WeeklyAvailability.query.filter_by(doctor_id=doctor_id).all()
    return jsonify([availability.serialize() for availability in availabilities]), 200


    # Filtrar las citas que ya están reservadas para ese doctor en esa fecha
    appointments = Date.query.filter(
        Date.doctor == str(doctor_id),
        db.func.date(Date.datetime) == date_obj
    ).all()

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




# Ruta para crear disponibilidad semanal
@api.route('/doctor/<int:doctor_id>/availability', methods=['POST'])
@jwt_required()
def create_weekly_availability(doctor_id):
    """
    Crea una disponibilidad semanal para un doctor.
    """
    data = request.get_json()
    day_of_week = data.get('day_of_week')
    start_time = datetime.strptime(data.get('start_time'), '%H:%M').time()
    end_time = datetime.strptime(data.get('end_time'), '%H:%M').time()

    availability = WeeklyAvailability(
        doctor_id=doctor_id,
        day_of_week=day_of_week,
        start_time=start_time,
        end_time=end_time
    )

    db.session.add(availability)
    db.session.commit()

    return jsonify(availability.serialize()), 201


@api.route('/doctor/<int:doctor_id>/availability-by-date', methods=['GET'])
@jwt_required()
def get_availability_by_date(doctor_id):
    """
    Obtener la disponibilidad de un doctor para una fecha específica.
    """
    date_str = request.args.get('date')
    print(f"Doctor ID: {doctor_id}, Date: {date_str}")  # Verificar la entrada

    try:
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        print(f"Parsed Date: {target_date}")  # Confirmar que la fecha es correcta
    except ValueError:
        return jsonify({"error": "Invalid date format, use 'YYYY-MM-DD'"}), 400

    day_of_week = target_date.weekday()  # 0 = lunes, 6 = domingo
    print(f"Day of Week: {day_of_week}")  # Verificar el día de la semana

    availabilities = WeeklyAvailability.query.filter_by(doctor_id=doctor_id, day_of_week=day_of_week).all()

    print(f"Availabilities found: {len(availabilities)}")  # Mostrar la cantidad de disponibilidades encontradas

    # Verificar cada disponibilidad
    for availability in availabilities:
        print(f"Availability: {availability.start_time} to {availability.end_time}")
        print(f"Doctor ID: {doctor_id}, Date: {date_str}")
        print(f"Parsed Date: {target_date}")
        print(f"Day of Week: {day_of_week}")
        print(f"Availabilities found: {len(availabilities)}")

    return jsonify([availability.serialize() for availability in availabilities]), 200


@api.route('/doctor/<int:doctor_id>/availability/<int:availability_id>', methods=['DELETE'])
@jwt_required()
def delete_weekly_availability(doctor_id, availability_id):
    availability = WeeklyAvailability.query.get(availability_id)
    if not availability:
        return jsonify({"message": "Availability not found"}), 404

    db.session.delete(availability)
    db.session.commit()

    return jsonify({"message": "Availability deleted successfully"}), 200


@api.route('/doctor/<int:doctor_id>/specific-availability-by-date', methods=['GET'])
@jwt_required()
def get_specific_availability_by_date(doctor_id):
    date_str = request.args.get('date')
    try:
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"error": "Invalid date format, use 'YYYY-MM-DD'"}), 400

    day_of_week = target_date.weekday()  # 0 = lunes, 6 = domingo
    availabilities = WeeklyAvailability.query.filter_by(doctor_id=doctor_id, day_of_week=day_of_week).all()

    return jsonify([availability.serialize() for availability in availabilities]), 200

# Ruta para actualizar la disponibilidad semanal de un doctor
@api.route('/doctor/<int:doctor_id>/availability/<int:availability_id>', methods=['PUT'])
@jwt_required()
def update_weekly_availability(doctor_id, availability_id):
    """
    Actualiza una disponibilidad semanal para un doctor.
    """
    body = request.get_json()
    availability = WeeklyAvailability.query.filter_by(id=availability_id, doctor_id=doctor_id).first()

    if not availability:
        return jsonify({"message": "Availability not found"}), 404

    # Actualizar los campos
    availability.day_of_week = body.get('day_of_week', availability.day_of_week)
    availability.start_time = datetime.strptime(body.get('start_time'), '%H:%M').time()
    availability.end_time = datetime.strptime(body.get('end_time'), '%H:%M').time()
    availability.is_available = body.get('is_available', availability.is_available)

    db.session.commit()

    return jsonify(availability.serialize()), 200


@api.route('/availability', methods=['GET'])
@jwt_required()
def get_all_availabilities():
    availabilities = WeeklyAvailability.query.all()
    return jsonify([availability.serialize() for availability in availabilities]), 200



@api.route('/api/statistics', methods=['GET'])
@jwt_required()
def get_statistics():
    # Example logic to get monthly appointments
    from sqlalchemy import extract
    from datetime import datetime

    current_year = datetime.now().year
    stats = []

    for month in range(1, 13):
        appointment_count = Date.query.filter(
            extract('month', Date.datetime) == month,
            extract('year', Date.datetime) == current_year
        ).count()
        stats.append({"month": datetime(1900, month, 1).strftime('%B'), "appointments": appointment_count})

    return jsonify(stats), 200


@api.route('/contact', methods=['POST'])
def contact():
    data = request.get_json()

    # Verifica que todos los campos requeridos estén presentes
    if not all(key in data for key in ('name', 'email', 'message')):
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    name = data['name']
    email = data['email']
    message = data['message']

    # Envía el mensaje por correo electrónico usando SendGrid
    try:
        send_email(name, email, message)
        return jsonify({"success": "Mensaje enviado con éxito"}), 200
    except Exception as e:
        print(f"Error al enviar el correo: {e}")
        return jsonify({"error": "Error al enviar el mensaje"}), 500

def send_email(name, email, message):
    # Configuración de SendGrid
    sendgrid_api_key = os.getenv('SENDGRID_API_KEY')  # Asegúrate de configurar la API Key en las variables de entorno
    sender_email = 'luck_caneo@hotmail.com'  # Cambia esto por tu correo verificado en SendGrid

    # Crear el correo electrónico
    email_message = Mail(
        from_email=sender_email,
        to_emails='luck_caneo@hotmail.com',  # Correo de destino
        subject=f'Nuevo mensaje de contacto de {name}',
        html_content=f'<strong>Nombre:</strong> {name}<br><strong>Email:</strong> {email}<br><strong>Mensaje:</strong><br>{message}'
    )

    # Enviar el correo
    sg = SendGridAPIClient(sendgrid_api_key)
    response = sg.send(email_message)
    print(response.status_code)
    print(response.body)
    print(response.headers)