from flask import Blueprint, request, jsonify
from models import db, Todo, SubTodo, Project, User
from datetime import datetime

bp = Blueprint('main', __name__)

@bp.route('/api/todos', methods=['GET'])
def get_todos():
    todos = Todo.query.all()
    return jsonify([{
        'id': todo.id,
        'taskName': todo.task_name,
        'dueDate': todo.due_date,
        'isCompleted': todo.is_completed,
        'subTodos': [{
            'id': sub.id,
            'taskName': sub.task_name,
            'dueDate': sub.due_date,
            'isCompleted': sub.is_completed,
        } for sub in todo.sub_todos]
    } for todo in todos])

@bp.route('/api/todos/today', methods=['GET'])
def get_today_todos():
    try:
        today = datetime.date.today()
        todos = Todo.query.filter(db.func.date(Todo.due_date) == today).all()
        todo_list = [{
            "id": t.id,
            "name": t.name,
            "dueDate": t.due_date.isoformat(),
            "completed": t.completed
        } for t in todos]
        return jsonify(todo_list), 200
    except Exception as e:
        print(f"Error retrieving today's todos: {e}")
        return jsonify({"error": "Failed to load today's todos"}), 500
    
@bp.route('/api/todos/overdue', methods=['GET'])
def get_overdue_todos():
    try:
        today = datetime.date.today()
        todos = Todo.query.filter(db.func.date(Todo.due_date) < today, Todo.completed == False).all()
        todo_list = [{
            "id": t.id,
            "name": t.name,
            "dueDate": t.due_date.isoformat(),
            "completed": t.completed
        } for t in todos]
        return jsonify(todo_list), 200
    except Exception as e:
        print(f"Error retrieving overdue todos: {e}")
        return jsonify({"error": "Failed to load overdue todos"}), 500

@bp.route('/todos', methods=['POST'])
def create_todo():
    data = request.json
    new_todo = Todo(
        task_name=data.get('taskName'),
        due_date=data.get('dueDate'),
        is_completed=data.get('isCompleted', False)
    )
    db.session.add(new_todo)
    db.session.commit()
    return jsonify({'message': 'Todo created successfully'}), 201

@bp.route('/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    todo = Todo.query.get(todo_id)
    if not todo:
        return jsonify({'message': 'Todo not found'}), 404

    data = request.json
    todo.task_name = data.get('taskName', todo.task_name)
    todo.due_date = data.get('dueDate', todo.due_date)
    todo.is_completed = data.get('isCompleted', todo.is_completed)
    
    db.session.commit()
    return jsonify({'message': 'Todo updated successfully'})

@bp.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    todo = Todo.query.get(todo_id)
    if not todo:
        return jsonify({'message': 'Todo not found'}), 404
    
    db.session.delete(todo)
    db.session.commit()
    return jsonify({'message': 'Todo deleted successfully'})

@bp.route('/subtodos', methods=['POST'])
def create_subtodo():
    data = request.json
    new_subtodo = SubTodo(
        task_name=data.get('taskName'),
        due_date=data.get('dueDate'),
        is_completed=data.get('isCompleted', False),
        parent_id=data.get('parentId')
    )
    db.session.add(new_subtodo)
    db.session.commit()
    return jsonify({'message': 'SubTodo created successfully'}), 201

@bp.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        projects = Project.query.all()
        project_list = [{
            "_id": p.id,
            "name": p.name,
            "user_id": p.user_id,
            # Include tasks if needed, otherwise remove or adjust
            "tasks": [{"id": task.id, "name": task.name} for task in p.tasks]
        } for p in projects]
        return jsonify(project_list), 200
    except Exception as e:
        print(f"Error retrieving projects: {e}")
        return jsonify({"error": "Failed to load projects"}), 500

@bp.route('/api/todos/completed', methods=['GET'])
def get_completed_todos():
    try:
        todos = Todo.query.filter_by(completed=True).all()
        todo_list = [{
            "id": t.id,
            "name": t.name,
            "completed": t.completed
        } for t in todos]
        return jsonify(todo_list), 200
    except Exception as e:
        print(f"Error retrieving completed todos: {e}")
        return jsonify({"error": "Failed to load completed todos"}), 500

@bp.route('/api/todos/incomplete', methods=['GET'])
def get_incomplete_todos():
    try:
        todos = Todo.query.filter_by(completed=False).all()
        todo_list = [{
            "id": t.id,
            "name": t.name,
            "completed": t.completed
        } for t in todos]
        return jsonify(todo_list), 200
    except Exception as e:
        print(f"Error retrieving incomplete todos: {e}")
        return jsonify({"error": "Failed to load incomplete todos"}), 500

@bp.route('/api/todos/total', methods=['GET'])
def get_total_todos():
    try:
        total_count = Todo.query.count()
        return jsonify(total_count), 200
    except Exception as e:
        print(f"Error retrieving total todos count: {e}")
        return jsonify({"error": "Failed to load total todos count"}), 500

@bp.route('/projects', methods=['POST'])
def create_project():
    try:
        data = request.json
        name = data.get('name')
        
        if not name:
            return jsonify({'error': 'Project name is required'}), 400

        # Create and add the new project to the database
        new_project = Project(name=name)
        db.session.add(new_project)
        db.session.commit()

        return jsonify({'id': new_project.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    try:
        project = Project.query.get_or_404(project_id)
        db.session.delete(project)
        db.session.commit()
        return jsonify({'message': 'Project deleted successfully'}), 200
    except:
        db.session.rollback()
        return jsonify({'error': str("there is database error")}), 500
    
@bp.route('/search', methods=['GET'])
def search_tasks():
    query = request.args.get('query', '').lower()
    results = Todo.query.filter(Todo.title.ilike(f'%{query}%')).all()
    tasks_list = [
        {"id": task.id, "title": task.title, "description": task.description, "isCompleted": task.isCompleted}
        for task in results
    ]

    return jsonify(tasks_list)

@bp.route('/generate-token', methods=['POST'])
def generate_token():
    # Retrieve JSON data from the request
    data = request.json
    user_id = data.get('userId')

    # Retrieve the Authorization header
    authorization_header = request.headers.get('Authorization')

    if authorization_header is None:
        # Handle missing Authorization header
        return jsonify({'error': 'Authorization header is missing'}), 400

    # Split the Authorization header to get the token
    try:
        token = authorization_header.split(" ")[1]
    except IndexError:
        # Handle malformed Authorization header
        return jsonify({'error': 'Malformed Authorization header'}), 400

    # Retrieve user data from the database
    user = User.query.get(user_id)
    if user:
        user.flask_token = token
    else:
        user = User(id=user_id, flask_token=token)
        db.session.add(user)
    
    db.session.commit()
    
    return jsonify({'token': token})