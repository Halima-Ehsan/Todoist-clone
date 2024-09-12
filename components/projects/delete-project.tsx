"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useToast } from "../../hooks/use-toast";

interface DeleteProjectProps {
  projectId?: string; 
}

export default function DeleteProject({ projectId }: DeleteProjectProps) {
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (!projectId) {
      toast({
        title: "Error",
        description: "Project ID is not available.",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/projects/${projectId}`);

      toast({
        title: "🗑️ Successfully deleted the project",
        duration: 3000,
      });
      router.push(`/loggedin/projects`);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete the project.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisIcon className="w-5 h-5 text-foreground hover:cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="w-40 lg:w-56">
          <form onSubmit={onSubmit}>
            <button
              type="submit"
              className="flex gap-2 p-2 hover:bg-red-500 hover:text-white rounded"
            >
              <Trash2 className="w-5 h-5 rotate-45 text-foreground/40" /> Delete
              Project
            </button>
          </form>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
