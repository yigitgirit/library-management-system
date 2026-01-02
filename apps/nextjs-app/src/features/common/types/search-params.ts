export type SearchParamPrimitive = string | number | boolean | null | undefined;

// This covers ?search=foo (string) and ?status=PAID&status=UNPAID (array)
export type SearchParamValue = SearchParamPrimitive | SearchParamPrimitive[];

export type SearchParams = Record<string, SearchParamValue>;

// Type for Next.js Page props.searchParams
export type NextPageSearchParams = { [key: string]: string | string[] | undefined };
