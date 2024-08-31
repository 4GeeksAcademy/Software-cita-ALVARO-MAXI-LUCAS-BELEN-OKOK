"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Date
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

api = Blueprint('api', __name__)

CORS(api)

            #RUTAS CORRESPONDIENTES A LOS USUARIOS

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_serialize = [user.serialize() for user in users]
    response_body = {
        "message": "These are all the users",
        "user": users_serialize
    }

    return jsonify(response_body), 200

# Creamos el signup para crear usuarios
@api.route('/signup', methods=['POST'])
def create_user():
    body = request.get_json()
    new_user = User(
        id = body['id'],
        name = body['name'], 
        last_name = body['last_name'], 
        document_type = body['document_type'], 
        document_number = body['document_number'], 
        address = body['address'], 
        role = body['role'], 
        email = body['email'], 
        password = body['password'], 
        phone = body['phone'])
    
    db.session.add(new_user)
    db.session.commit()

    response_body = {
        "message": "User created successfully!"
    }

    return jsonify(response_body), 200

@api.route('/login' , methods=['POST'])
def login():
    body = request.get_json()
    email_user = body['email']
    password_user = body['password']

    user = User.query.filter_by(email = email_user, password = password_user).first()
    
    if user == None:
        return jsonify({
            "message": "Incorrect username and/or password"
        }), 401
    access_token = create_access_token(identity = user.serialize())

    response_body = {
        "message": "Token created successfully",
        "token": access_token
    }

    return jsonify(response_body), 200

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
    
    new_date = Date(
        speciality=body['speciality'],
        doctor=body['doctor'],
        datetime=body['datetime'],
        reason_for_appointment=body['reason_for_appointment'],
        date_type=body['date_type'],
        user_id=body['user_id']
    )
    
    db.session.add(new_date)
    db.session.commit()
    
    return jsonify({"message": "Date created successfully", "date": new_date.serialize()}), 201


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
