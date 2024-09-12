"use client";
import React from "react";

// Define the Todo type
interface Todo {
  id: number;
  taskName: string;
  dueDate: string;
  isCompleted: boolean;
  subTodos?: Todo[];
}

// Define the props for the Task component
interface TaskProps {
  data: Todo;
  isCompleted: boolean;
  handleOnChange: () => void;
}

const Task: React.FC<TaskProps> = ({ data, isCompleted, handleOnChange }) => {
  return (
    <div>
      <input 
        type="checkbox" 
        checked={isCompleted} 
        onChange={handleOnChange} 
      />
      <span>{data.taskName}</span>
      <div>Due Date: {data.dueDate}</div>
      <div>Status: {isCompleted ? "Completed" : "Not Completed"}</div>

      {data.subTodos && data.subTodos.length > 0 && (
        <div>
          <h4>Subtasks:</h4>
          {data.subTodos.map(sub => (
            <div key={sub.id}>
              <div>Subtask: {sub.taskName}</div>
              <div>Due Date: {sub.dueDate}</div>
              <div>Status: {sub.isCompleted ? "Completed" : "Not Completed"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Task;



