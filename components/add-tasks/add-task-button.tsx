import React, { useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";

// Type definitions
interface AddTaskWrapperProps {
  parentTask?: {
    _id: string;
    projectId: string;
    priority?: number;
  };
  projectId?: string;
}

interface TaskData {
  taskName: string;
  dueDate?: string;
  isCompleted: boolean;
}

// AddTaskInline component
interface AddTaskInlineProps {
  setShowAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  parentTask?: {
    _id: string;
    projectId: string;
    priority?: number;
  };
  projectId?: string;
  onAddTask: (taskData: TaskData) => void;
}

const AddTaskInline: React.FC<AddTaskInlineProps> = ({ setShowAddTask, parentTask, projectId, onAddTask }) => {
  const [taskName, setTaskName] = useState<string>("");
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleSubmit = () => {
    onAddTask({ taskName, dueDate, isCompleted });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <input
        type="date"
        value={dueDate || ""}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <label>
        Completed
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
        />
      </label>
      <button onClick={handleSubmit}>Add Task</button>
      <button onClick={() => setShowAddTask(false)}>Cancel</button>
    </div>
  );
};

// AddTaskButton component
interface AddTaskButtonProps {
  onClick: () => void;
  title: string;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onClick, title }) => {
  return (
    <button className="pl-2 flex mt-2 flex-1" onClick={onClick}>
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <div className="flex items-center gap-2 justify-center">
          <Plus className="h-4 w-4 text-primary hover:bg-primary hover:rounded-xl hover:text-white" />
          <h3 className="text-base font-light tracking-tight text-foreground/70">
            {title}
          </h3>
        </div>
      </div>
    </button>
  );
};

// AddTaskWrapper component
const AddTaskWrapper: React.FC<AddTaskWrapperProps> = ({ parentTask, projectId }) => {
  const [showAddTask, setShowAddTask] = useState<boolean>(false);

  const handleAddTask = (taskData: TaskData) => {
    axios
      .post("http://localhost:5000/todos", {
        taskName: taskData.taskName,
        dueDate: taskData.dueDate,
        isCompleted: taskData.isCompleted,
        parentId: parentTask?._id,
        projectId: projectId,
      })
      .then(() => {
        setShowAddTask(false);
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  return showAddTask ? (
    <AddTaskInline
      setShowAddTask={setShowAddTask}
      parentTask={parentTask}
      projectId={projectId}
      onAddTask={handleAddTask}
    />
  ) : (
    <AddTaskButton
      onClick={() => setShowAddTask(true)}
      title={parentTask?._id ? "Add sub-task" : "Add task"}
    />
  );
};

export default AddTaskWrapper;

