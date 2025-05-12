import { Operators } from "../enums/collection.enums";

export interface Query {
  where?: Where[][] | undefined;
  skip?: number;
  take?: number;
  sort?: Sort[];
  includes?: string[];
}

export interface Where {
  field: string;
  operator: keyof typeof Operators;
  value?: string | number | boolean | Array<string | number>;
}

export interface Sort {
  field: string;
  direction: "ASC" | "DESC";
}
