"use client";
import { useEffect, useState } from "react";
import  AddTaskWrapper  from "../add-tasks/add-task-button";
import Todos from "../todos/todos";
import CompletedTodos from "../todos/completed-todos";
import { Dot } from "lucide-react";
import moment from "moment";

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

export default function Today() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todayTodos, setTodayTodos] = useState<Todo[]>([]);
  const [overdueTodos, setOverdueTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseTodos = await fetch('http://localhost:5000/api/todos');
        const todosData = await responseTodos.json();
        setTodos(todosData);

        const responseTodayTodos = await fetch('http://localhost:5000/api/todos/today');
        const todayTodosData = await responseTodayTodos.json();
        setTodayTodos(todayTodosData);

        const responseOverdueTodos = await fetch('http://localhost:5000/api/todos/overdue');
        const overdueTodosData = await responseOverdueTodos.json();
        setOverdueTodos(overdueTodosData);

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
        <h1 className="text-lg font-semibold md:text-2xl">Today</h1>
      </div>
      <div className="flex flex-col gap-1 py-4">
        <p className="font-bold flex text-sm">Overdue</p>
        <Todos items={overdueTodos} />
      </div>
      <AddTaskWrapper />
      <div className="flex flex-col gap-1 py-4">
        <p className="font-bold flex text-sm items-center border-b-2 p-2 border-gray-100">
          {moment(new Date()).format("LL")}
          <Dot />
          Today
          <Dot />
          {moment(new Date()).format("dddd")}
        </p>
        <Todos items={todayTodos} />
      </div>
    </div>
  );
}
