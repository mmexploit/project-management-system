// Types
export interface Task {
  id: string;
  name: string;
  status: string;
  project_id?: string;
  assignee: { name: string; assignee_id: string };
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Tasks {
  [key: string]: Task;
}

export interface Columns {
  [key: string]: Column;
}

export interface ColumnOrder {
  columnOrder: string[];
}

export interface InitialData extends ColumnOrder {
  tasks: Tasks;
  columns: Columns;
}
