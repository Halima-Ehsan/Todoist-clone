"use client";
import { useEffect, useState } from "react";
import Todos from "./todos";
import CompletedTodos from "./completed-todos";
import AddTaskWrapper  from "../add-tasks/add-task-button";

interface SubTodo {
  id: number;
  taskName: string;
  dueDate: string;
  isCompleted: boolean;
}

interface Todo {
  id: number;
  taskName: string;
  dueDate: string;
  isCompleted: boolean;
  subTodos: SubTodo[];
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [inCompleteTodos, setInCompleteTodos] = useState<Todo[]>([]);
  const [totalTodos, setTotalTodos] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseTodos = await fetch('http://localhost:5000/api/todos');
        const todosData: Todo[] = await responseTodos.json();
        setTodos(todosData);
  
        const responseCompletedTodos = await fetch('http://localhost:5000/api/todos/completed');
        const completedTodosData: Todo[] = await responseCompletedTodos.json();
        setCompletedTodos(completedTodosData);
  
        const responseInCompleteTodos = await fetch('http://localhost:5000/api/todos/incomplete');
        const inCompleteTodosData: Todo[] = await responseInCompleteTodos.json();
        setInCompleteTodos(inCompleteTodosData);
  
        const responseTotalTodos = await fetch('http://localhost:5000/api/todos/total');
        const totalTodosData: number = await responseTotalTodos.json();
        setTotalTodos(totalTodosData);
  
        setLoading(false);
      } catch (err) {
        setError('Failed to load todos');
        setLoading(false);
      }
    }
  
    fetchData();
  }, []);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Task</h1>
      </div>
      <div className="flex flex-col gap-1 py-4">
        <Todos items={inCompleteTodos} />
      </div>
      <AddTaskWrapper/>
      <div className="flex flex-col gap-1 py-4">
        <Todos items={completedTodos} />
      </div>
      <CompletedTodos totalTodos={totalTodos} />
    </div>
  );
}
