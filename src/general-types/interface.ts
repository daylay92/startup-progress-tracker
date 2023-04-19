export interface GetMany<T> {
  term?: string;
  select: (keyof T)[];
}

export interface GetOneData<T> {
  select?: (keyof T)[];
  id: string;
}
