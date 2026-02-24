export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "like"
  | "in"
  | "isNull"
  | "isNotNull";

export interface IFilter {
  field: string;
  operator: FilterOperator;
  value?: string | number | boolean | (string | number)[];
}

export interface IJoinFilter {
  table: string;
  field: string;
  targetField: string;
  filters: IFilter[];
}

export interface IQueryRequest {
  table: string;
  select?: string[];
  filters?: IFilter[];
  limit?: number;
  offset?: number;
  joins?: IJoinFilter[];
}

export interface IQueryResponse<T = Record<string, unknown>> {
  data: T[];
  total: number;
  limit?: number;
  offset: number;
}

export interface IMedianRequest {
  table: string;
  field: string;
  filters?: IFilter[];
  joins?: IJoinFilter[];
}

export interface IMedianResponse {
  table: string;
  field: string;
  median: number | null;
  count: number;
}

export interface IFrequencyRequest {
  table: string;
  field: string;
  filters?: IFilter[];
  joins?: IJoinFilter[];
  asBoolean?: boolean;
}

export interface IFrequencyItem {
  value: string | boolean | null;
  count: number;
  percentage: number;
}

export interface IFrequencyResponse {
  table: string;
  field: string;
  total: number;
  data: IFrequencyItem[];
}

export interface INewFrequencyResponse {
  total: number;
  data: IFrequencyItem[];
}

export interface ITableInfo {
  name: string;
  columns: string[];
}
