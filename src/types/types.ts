import React from "react";
import { FieldHookConfig } from "formik";

export interface IClassNameProps {
  className?: string;
  onClick?: any;
}

export interface IChildrenProps {
  children: React.ReactNode;
}

export interface ICommonHeaderProps extends IClassNameProps, IChildrenProps {
  image: string;
  primaryHeading?: React.ReactNode;
  secondaryHeading?: string;
  paragraph?: string;
  type?: "sign-in" | "sign-up";
  additionBody?: React.ReactNode;
}

export interface ITextProps extends IClassNameProps, IChildrenProps {}

export interface IIconLink extends IClassNameProps {
  url: string;
  Icon: React.ComponentType<{ className?: string }>; // Adjust the type of Icon prop
  text: string;
  username?: string;
}

// Define IInputFieldPropsBase for the custom properties you want to add
export interface IInputFieldPropsBase {
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  readonly?: boolean;
}

// Use type intersection to combine IInputFieldPropsBase with FieldHookConfig<string>
export type IInputFieldProps = IInputFieldPropsBase & FieldHookConfig<string>;

export interface IRegisterValues {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface ITitleText {
  text: string;
}

export interface Post {
  id: string;
  author: {
    username: string;
    image: string | null;
  };
  image: {
    url: string;
    caption: string | undefined;
    public_id: string;
  };
  content: string;
  hashtags: string[];
  likesCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  isSavedByCurrentUser: boolean;
  createdAt: Date;
}

export interface FormikSelectProps {
  name: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  value?: { value: string; label: string };
  onChange?: (selectedOption: { value: string; label: string } | null) => void;
}

export interface SingleSelectProps {
  value: string;
  label: string;
}
export type Status = "In Progress" | "Pending" | "Completed";
export type Priority = "High" | "Medium" | "Low";

export interface Task {
  id: string | number;
  title: string;
  description: string;
  status: any;
  priority: any;
  [key: string]: any;
  dueData: string | null;
}
export interface Option {
  value: string;
  label: string;
}


export interface TasksTableProps {
  tasks: Task[];
  onUpdate?: () => void;
}

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  isEditing: boolean;
  handleUpdate: any;
  refetch?: () => void;
}

export interface TaskDropdownProps {
  task: Task;
  type: "status" | "priority";
  handleUpdate: (updatedTask: Task) => void;
}
export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  isEditing: boolean;
  handleUpdate: any;
}

export interface TaskFormValues {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: Date | null | string;
}

export interface TaskFormProps {
  task: TaskFormValues;
  onSubmit: (values: TaskFormValues) => void;
}
