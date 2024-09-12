"use client";
import React from "react"; // Add React import
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "../../hooks/use-toast";
import { CalendarIcon, Text } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { CardFooter } from "../ui/card";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import moment from "moment"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";

interface Task {
    taskName: string;
    description?: string;
    dueDate: Date;
    priority: string;
    projectId: string;
  }

const FormSchema = z.object({
  taskName: z.string().min(2, {
    message: "Task name must be at least 2 characters.",
  }),
  description: z.string().optional().default(""),
  dueDate: z.date({ required_error: "A due date is required" }),
  priority: z.string().min(1, { message: "Please select a priority" }),
  projectId: z.string().min(1, { message: "Please select a Project" }),
});

interface AddTaskInlineProps {
    setShowAddTask: Dispatch<SetStateAction<boolean>>;
    parentTask?: {
      _id: string;
      projectId: string;
      priority?: number;
    };
    projectId?: string; 
    onAddTask: (taskData: Task) => void;
  }

interface Project {
  _id: string;
  name: string;
  // Add other properties if needed
}

export default function AddTaskInline({
  setShowAddTask,
  parentTask,
  projectId: myProjectId,
  onAddTask,
}: AddTaskInlineProps) {
  const projectId =
    myProjectId ||
    parentTask?.projectId ||
    "default-project-id"; 

  const priority = parentTask?.priority?.toString() || "1";
  const parentId = parentTask?._id;

  const { toast } = useToast();
  const [projects, setProjects] = React.useState<Project[]>([]);

  React.useEffect(() => {
    // Fetch projects from the API
    axios.get<Project[]>("http://localhost:5000/api/projects").then(response => setProjects(response.data));
  }, []);

  const defaultValues = {
    taskName: "",
    description: "",
    priority: priority,
    dueDate: new Date(),
    projectId: projectId || "", 
  };
  

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { taskName, description, priority, dueDate, projectId } = data;

    try {
      if (projectId) {
        if (parentId) {
          // Subtask
          await axios.post("http://localhost:5000/subtodos", {
            parentId,
            taskName,
            description,
            priority: parseInt(priority),
            dueDate: moment(dueDate).valueOf(),
            projectId,
          });
        } else {
          // Task
          await axios.post("http://localhost:5000/api/todos", {
            taskName,
            description,
            priority: parseInt(priority),
            dueDate: moment(dueDate).valueOf(),
            projectId,
          });
        }
        toast({
          title: "🦄 Created a task!",
          duration: 3000,
        });
        form.reset({ ...defaultValues });
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 border-2 p-2 border-gray-200 my-2 rounded-xl px-3 pt-4 border-foreground/20"
        >
          <FormField
            control={form.control}
            name="taskName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="taskName"
                    type="text"
                    placeholder="Enter your Task name"
                    required
                    className="border-0 font-semibold text-lg"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-start gap-2">
                    <Text className="ml-auto h-4 w-4 opacity-50" />
                    <Textarea
                      id="description"
                      placeholder="Description"
                      className="resize-none"
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "flex gap-2 w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={priority}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4].map((item, idx) => (
                        <SelectItem key={idx} value={item.toString()}>
                          Priority {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={projectId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project._id} value={project._id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <CardFooter className="mt-4 ml-5">
            <Button type="submit">Add Task</Button>
            <Button
              variant="outline"
              className="ml-4"
              onClick={() => setShowAddTask(false)}
            >
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
