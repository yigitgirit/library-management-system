export type Category = {
  id: number;
  name: string;
  description?: string;
}

export type CategorySearchParams = {
  name?: string;
  page?: number;
  size?: number;
  sort?: string[];
}
