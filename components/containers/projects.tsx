"use client";
import { useEffect, useState } from "react";
import { Hash } from "lucide-react";
import Link from "next/link";
import { Label } from "../ui/label";

interface Project {
  _id: string;
  name: string;
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000//api/projects')
      .then(response => response.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load projects');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Projects</h1>
      </div>
      <div className="flex flex-col gap-1 py-4">
        {projects.map((project) => (
          <Link key={project._id} href={`http://localhost:5000/projects/${project._id}`}>
            <div className="flex items-center space-x-2 border-b-2 p-2 border-gray-100">
              <Hash className="text-primary w-5" />
              <Label
                htmlFor="projects"
                className="text-base font-normal hover:cursor-pointer"
              >
                {project.name}
              </Label>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
