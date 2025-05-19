import React from "react";
import {FieldHookConfig} from "formik";

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

export interface User {
  id: string;
  email: string;
  password?: string;
  name?: string;
  displayName: string;
  role: string;
  permissions: string[];
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string; // Assuming dates are passed as ISO strings
  endDate: string;
  files: any[];
  user: {
    email: string;
    displayName: string;
  };
  assignedUsers: any[];
  createdAt: string;
  project: {
    id: string;
    title: string;
    archived: boolean;
  }
}

export interface TaskProps {
  task: ITask;
  index: number;
  onClick: (task: ITask) => void; // Callback to open modal with task details
  refetch: () => void;
}
export type FileType =
  | "PDF"
  | "Word"
  | "Excel"
  | "Text"
  | "XLSX"
  | "issueFile"
  | "projectFile";

export interface DocumentDataRow {
  id: string;
  fileId: string;
  fileName: string;
  date: string;
  filePath: string;
  type: FileType;
  status?: string;
  location?: string;
  extension?: string;
  createdAt: Date;
  updatedAt: Date;
  issue?: {
    id: string;
    title: string;
  };
  signaturePath?: string;
  initialPath?: string;
  time?: string;
  isSigned?: boolean;
  isOrder: boolean;
}

export interface UploadedFile {
  id: string;
  filePath: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  status: { label: string; value: string } | null;
  files: File[];
  companyId: string | null;
  userIds?: string[];
  isOrder: boolean;
}
export interface OrderFormData {
  name: string;
  description: string;
  location: string;
  price: number | undefined;
  startDate: Date | null;
  endDate: Date | null;
  status: { label: string; value: string } | null;
  files: File[];
  companyId: string | null;
}

export interface CreateOrEditProjectProps {
  initialData?: ProjectFormData;
  mode: "create" | "edit";
  onSubmit: (formData: ProjectFormData, resetFormData: () => void) => void;
  isLoading?: boolean;
  isSuccess?: boolean;
}

export interface CreateOrEditOrderProps {
  initialData?: OrderFormData;
  mode: "create" | "edit";
  onSubmit: (formData: OrderFormData, resetFormData: () => void) => void;
  isLoading?: boolean;
  isSuccess?: boolean;
}

export interface OrderInfoProps {
  data: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    location: string | null;
    price: number | null;
    startDate: string;
    endDate: string;
    company: {
      id: string,
      name: string
    };
  };
  isLoading: boolean;
}

export interface Task {
  id: string;
  status: string;
  [key: string]: any;
}

export interface ColumnType {
  id: string;
  name: string;
  tasks: Task[];
}

export interface Company {
  id: string;
  name: string;
}

export interface ProjectInfoProps {
  projectData: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    startDate: string | null;
    endDate: string | null;
    companyName: string | null;
    isOrder: boolean;
    user: {
      displayName: string;
    };
    company: {
      id: string;
      name: string;
    };
    assignedUsers: [{ user: { id: string; displayName: string } }];
  };
  refetch: () => void;
}


export interface Metadata  {
  username: string;
  userId: string;
  projectId?: string;
  orderId?: string;
  mode?: 'annotation' | 'signature';
  isSigned?: boolean;
}

export interface IAnnotationProps {
  userId: string;
  fileId: string;
  projectId?: string;
  orderId?: string;
  username: string;
  filePath: string;
  isSigned: boolean;
}
