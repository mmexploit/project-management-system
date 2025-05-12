import { Operators } from "@/shared/collection/enums/collection.enums";
import type { Query } from "@/shared/collection/model/query.model";
import { DataTableColumn } from "mantine-datatable";
import { ReactNode } from "react";

export interface EntityProps<T extends object> {
  data: T[];
  config: EntityConfigProps<T>;
  onRequestChange?: (request: Query) => void;
  onDelete?: (id: string) => void;
  total?: number;
}

export interface EntityConfigProps<T extends object> {
  title: string;
  columns: Array<DataTableColumn<T>>;
  isFetching?: boolean;
  baseUrl: string;
  detailUrl?: string;
  primaryColumn: string | {label: string, value: string}[];
  showNewButton?: boolean;
  showActionColumn?: boolean;
  additionalActions?: ReactNode;
  showExport?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  onSelectedRecordsChange?: (selectedRecords: T[]) => void;
  filterConfig?: FilterConfig[];
}

export interface FilterConfig {
  label: string;
  column: string;
  operator: keyof typeof Operators;
  options: Record<string, string | boolean>[];
}

export interface PreviewEntityConfigProps<T extends object> {
  records: T[];
  columns: Array<DataTableColumn<T>>;
  detailUrl: string;
  title: string;
  isFetching?: boolean;
}
