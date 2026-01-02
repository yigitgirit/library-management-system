export type Author = {
  id: number;
  name: string;
  biography?: string;
  birthDate?: string;
  deathDate?: string;
}

export type AuthorSearchParams = {
  name?: string;
  page?: number;
  size?: number;
  sort?: string[];
}
