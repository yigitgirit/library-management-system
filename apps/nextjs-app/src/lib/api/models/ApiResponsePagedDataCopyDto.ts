/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiErrorResponse } from './ApiErrorResponse';
import type { PagedDataCopyDto } from './PagedDataCopyDto';
export type ApiResponsePagedDataCopyDto = {
    success?: boolean;
    timestamp?: string;
    message?: string;
    data?: PagedDataCopyDto;
    error?: ApiErrorResponse;
};

