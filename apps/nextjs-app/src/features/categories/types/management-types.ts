export type CategoryDto = {
  id: number;
  name: string;
  description: string;
}

export type CategoryCreateRequest = {
  name: string;
  description: string;
}

export type CategoryUpdateRequest = {
  name: string;
  description: string;
}

export type CategorySearchParams = {
  name?: string;
  page?: number;
  size?: number;
  sort?: string;
}
