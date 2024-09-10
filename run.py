from app import db, create_app
from flask import Flask, jsonify
'''app = Flask(__name__)'''
app = create_app()

with app.app_context():
     db.create_all()
     

@app.route('/test', methods=['GET'])
def test_route():
    return jsonify({'message': 'Test route works!'})
    
if __name__ == '__main__':
     app.run(host='0.0.0.0', port=5000, debug=True)

'''from flask import Flask, request, jsonify

app = Flask(__name__)
@app.route('/')
def home():
    return "Flask app is running!", 200

@app.route('/hello', methods=['GET'])
def hello_world():
    return jsonify({"message": "Hello, World!"}), 200

@app.route('/echo', methods=['POST'])
def echo():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    return jsonify({"you_sent": data}), 200

@app.route('/add', methods=['POST'])
def add_numbers():
    data = request.get_json()
    try:
        num1 = data.get('num1')
        num2 = data.get('num2')
        result = num1 + num2
        return jsonify({"result": result}), 200
    except TypeError:
        return jsonify({"error": "Please provide valid numbers"}), 400

if __name__ == '__main__':
    app.run(debug=True)'''

