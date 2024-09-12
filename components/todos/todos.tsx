"use client";
import React from "react";
import Task from "./Task";
import { useToast } from "../../hooks/use-toast";
import axios from "axios";

// Define the Todo type
interface Todo {
  id: number;
  taskName: string;
  dueDate: string;
  isCompleted: boolean;
  subTodos?: SubTodo[];
}

interface SubTodo {
  id: number;
  taskName: string;
  dueDate: string;
  isCompleted: boolean;
}


interface TodosProps {
  items: Todo[];
}

export default function Todos({ items }: TodosProps) {
  const { toast } = useToast();

  const handleOnChangeTodo = (task: Todo) => {
    const updatedTask: Todo = { ...task, isCompleted: !task.isCompleted };
    
    // Update todo in Flask API
    axios.put(`http://localhost:5000/todos/${task.id}`, updatedTask)
      .then(() => {
        // Update the local state or items array here if needed
        if (updatedTask.isCompleted) {
          toast({
            title: "✅ Task completed",
            description: "You're a rockstar",
            duration: 3000,
          });
        }
      })
      .catch(error => {
        console.error("There was an error updating the todo!", error);
      });
  };

  if (!Array.isArray(items)) {
    return <p>No tasks available</p>;
  }

  return (
    <>
      {items.map((task) => (
        <Task
          key={task.id}
          data={task}
          isCompleted={task.isCompleted}
          handleOnChange={() => handleOnChangeTodo(task)}
        />
      ))}
    </>
  );
}
