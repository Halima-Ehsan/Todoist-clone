"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserProfile from "./user-profile";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Hash, Plus as PlusIcon } from "lucide-react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import AddProjectDialog from "../projects/add-project-dialog";
import { primaryNavItems } from "@/utils";

interface NavItem {
  id?: string; 
  name: string;
  link: string;
  icon: JSX.Element;
}

// Define the type for the list of title IDs
interface MyListTitleType {
  [key: string]: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [projectList, setProjectList] = useState<Array<{ id: string, name: string }> | null>(null);
  const [navItems, setNavItems] = useState<NavItem[]>([...primaryNavItems]);

  // Fetch projects from Flask backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/projects');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProjectList(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchProjects();
  }, []);

  // Render the navigation items
  useEffect(() => {
    if (projectList) {
      const renderItems = (projectList: Array<{ id: string, name: string }>): NavItem[] => {
        return projectList.map(({ id, name }, idx) => ({
          ...(idx === 0 && { id: "projects" }),
          name,
          link: `/loggedin/projects/${id}`,
          icon: <Hash className="w-4 h-4" />,
        }));
      };

      const projectItems = renderItems(projectList);
      const items = [...primaryNavItems, ...projectItems];
      setNavItems(items);
    }
  }, [projectList]);

  const LIST_OF_TITLE_IDS: MyListTitleType = {
    primary: "",
    projects: "Projects",
  };

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex justify-between h-14 items-center border-b p-1 lg:h-[60px] lg:px-2">
          <UserProfile />
        </div>
        <nav className="grid items-start px-1 text-sm font-medium lg:px-4">
          {navItems.map(({ name, icon, link, id }, idx) => (
            <div key={idx}>
              {id === "projects" && (
                <div className="flex items-center mt-6 mb-2">
                  <p className="flex flex-1 text-base">
                    {LIST_OF_TITLE_IDS[id]}
                  </p>
                  <AddProjectDialog />
                </div>
              )}
              <div className={cn("flex items-center lg:w-full")}>
                <div
                  className={cn(
                    "flex items-center text-left lg:gap-3 rounded-lg py-2 transition-all hover:text-primary justify-between w-full",
                    pathname === link
                      ? "active rounded-lg bg-primary/10 text-primary transition-all hover:text-primary"
                      : "text-foreground"
                  )}
                >
                  <Link
                    href={link}
                    className={cn(
                      "flex items-center text-left gap-3 rounded-lg transition-all hover:text-primary w-full"
                    )}
                  >
                    <div className="flex gap-4 items-center w-full">
                      <div className="flex gap-2 items-center">
                        <p className="flex text-base text-left">
                          {icon || <Hash />}
                        </p>
                        <p>{name}</p>
                      </div>
                    </div>
                  </Link>
                  {id === "projects" && (
                    <Dialog>
                      <DialogTrigger id="addProject">
                        <PlusIcon
                          className="h-5 w-5"
                          aria-label="Add a Project"
                        />
                      </DialogTrigger>
                      <AddProjectDialog />
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
