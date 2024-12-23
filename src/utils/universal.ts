import { SingleSelectProps } from "../types/types";
import * as Yup from "yup";

export const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

// src/utils/statusColors.ts
export const statusColors: { [key: string]: string } = {
    completed: 'text-green-500',
    pending: 'text-yellow-500',
    in_progress: 'text-blue-500',
};


// src/utils/priorityColors.ts
export const priorityColors: { [key: string]: string } = {
    high: 'text-red-500',
    medium: 'text-yellow-500',
    low: 'text-green-500',
};




export const roleOptions: SingleSelectProps[] = [
  { value: "USER", label: "User" },
  { value: "MANAGER", label: "Manager" },
  { value: "ADMIN", label: "Admin" },
];


export const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  role: Yup.string().required("Role is required"),
});

// Function to generate a random password
export const generateRandomPassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  const passwordLength = 12;
  let password = "";
  for (let i = 0; i < passwordLength; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
