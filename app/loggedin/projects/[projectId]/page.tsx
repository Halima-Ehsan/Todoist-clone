"use client";
import AddTaskWrapper from "@/components/add-tasks/add-task-button";
import SideBar from "@/components/navbar/Sidebar";
import DeleteProject from "@/components/projects/delete-project";
import CompletedTodos from "@/components/todos/completed-todos";
import Todos from "@/components/todos/todos";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProjectIdPage() {
  const { projectId } = useParams<{ projectId?: string }>();
  const [project, setProject] = useState<any>(null);
  const [inCompletedTodos, setInCompletedTodos] = useState<any[]>([]);
  const [completedTodos, setCompletedTodos] = useState<any[]>([]);
  const [projectTodosTotal, setProjectTodosTotal] = useState(0);

  useEffect(() => {
    if (!projectId) return; 

    const fetchProjectData = async () => {
      try {
        const projectResponse = await axios.get(`http://localhost:5000/projects/${projectId}`);
        setProject(projectResponse.data);

        const todosResponse = await axios.get(`http://localhost:5000/projects/${projectId}/todos`);
        setInCompletedTodos(todosResponse.data.incompleted_todos);
        setCompletedTodos(todosResponse.data.completed_todos);

        const totalTodosResponse = await axios.get(`http://localhost:5000/projects/${projectId}/todos/total`);
        setProjectTodosTotal(totalTodosResponse.data.total);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, [projectId]);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideBar />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <div className="xl:px-40">
            <div className="flex items-center justify-between flex-wrap gap-2 lg:gap-0">
              <h1 className="text-lg font-semibold md:text-2xl">
                {project?.name || "Project"}
              </h1>
              <div className="flex gap-6 lg:gap-12 items-center">
                <DeleteProject projectId={projectId} />
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-4">
              <Todos items={inCompletedTodos} />

              <div className="pb-6">
                <AddTaskWrapper projectId={projectId} />
              </div>

              <Todos items={completedTodos} />
              <div className="flex items-center space-x-4 gap-2 border-b-2 p-2 border-gray-100 text-sm text-foreground/80">
                <CompletedTodos totalTodos={projectTodosTotal} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
