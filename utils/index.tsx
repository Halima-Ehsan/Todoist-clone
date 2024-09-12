import { Plus, Calendar, Hash } from 'lucide-react';

export const primaryNavItems = [
  {
    name: "Add Tasks",
    link: "/loggedin/today",
    icon: <Plus className="w-4 h-4" />,
  },
  {
    name: "Today",
    link: "/loggedin/today",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    name: "My Projects",
    link: "#",
    icon: <Hash className="w-4 h-4" />,
  },
];
