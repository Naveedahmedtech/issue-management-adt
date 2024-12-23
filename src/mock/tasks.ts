import { format } from "date-fns";

export const priorityOptions = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

export const statusOptions = [
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
];


export const recentTasks = [
  {
    id: 1,
    title: "Task 1",
    description:
      "Complete the report for the quarterly financials, ensuring all data is accurate and verified before submission to the management team for review.",
    status: "In Progress",
    priority: "High",
    dueDate: format(new Date("2024-12-15"), "yyyy-MM-dd"), // Example due date
  },
  {
    id: 2,
    title: "Task 2",
    description:
      "Prepare presentation slides for the annual performance review.",
    status: "Pending",
    priority: "Medium",
    dueDate: format(new Date("2024-11-20"), "yyyy-MM-dd"),
  },
  {
    id: 3,
    title: "Task 3",
    description:
      "Follow up with the marketing team on the new campaign launch and gather feedback.",
    status: "Completed",
    priority: "Low",
    dueDate: format(new Date("2024-11-10"), "yyyy-MM-dd"),
  },
  {
    id: 4,
    title: "Task 4",
    description: "Draft the technical documentation for the new API release.",
    status: "In Progress",
    priority: "Critical",
    dueDate: format(new Date("2024-11-25"), "yyyy-MM-dd"),
  },
];
