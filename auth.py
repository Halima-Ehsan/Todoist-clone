from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import User, db

app = Flask(__name__)

@app.route('/api/register', methods=['POST'])
def register():
    print("Register route hit")
    data = request.get_json()
    print(f"Received data: {data}")
    if 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Missing required fields!"}), 400

    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    print("User created successfully")
    return jsonify({"message": "User created successfully!"}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    print("Login route hit")
    data = request.get_json()
    print(f"Received data: {data}")
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        print(f"Access token created for user {user.id}")
        return jsonify({"access_token": access_token}), 200
    print("Invalid credentials")
    return jsonify({"message": "Invalid credentials!"}), 401



