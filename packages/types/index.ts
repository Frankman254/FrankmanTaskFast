// Shared types between frontend and backend

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: string;
  project_id: string;
  name: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  column_id: string;
  title: string;
  description?: string;
  position: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface CreateColumnRequest {
  project_id: string;
  name: string;
  position: number;
}

export interface UpdateColumnRequest {
  name?: string;
  position?: number;
}

export interface CreateTaskRequest {
  column_id: string;
  title: string;
  description?: string;
  position: number;
  due_date?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  position?: number;
  due_date?: string;
  column_id?: string;
}
