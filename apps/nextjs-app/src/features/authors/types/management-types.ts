export type AuthorDto = {
  id: number;
  name: string;
  biography: string;
  birthDate: string;
  deathDate?: string;
}

export type AuthorCreateRequest = {
  name: string;
  biography: string;
  birthDate: string;
  deathDate?: string;
}

export type AuthorUpdateRequest = {
  name: string;
  biography: string;
  birthDate: string;
  deathDate?: string;
}

export type AuthorSearchParams = {
  name?: string;
  page?: number;
  size?: number;
  sort?: string;
}
