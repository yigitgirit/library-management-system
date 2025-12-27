/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiErrorResponse } from './ApiErrorResponse';
import type { PagedDataBookDto } from './PagedDataBookDto';
export type ApiResponsePagedDataBookDto = {
    success?: boolean;
    timestamp?: string;
    message?: string;
    data?: PagedDataBookDto;
    error?: ApiErrorResponse;
};

