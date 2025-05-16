
interface User {
  id: string;
  displayName: string | null;
}

export interface Comment {
  id: string;
  message: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
}

export interface CommentsProps {
  projectId: string | undefined;
  comments?: Comment[];
  page: number;
  totalPages: number;
  total: number;
  setPage: (page: number) => void;
  isLoading: boolean;
}
