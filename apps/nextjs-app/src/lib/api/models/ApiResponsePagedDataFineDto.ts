/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiErrorResponse } from './ApiErrorResponse';
import type { PagedDataFineDto } from './PagedDataFineDto';
export type ApiResponsePagedDataFineDto = {
    success?: boolean;
    timestamp?: string;
    message?: string;
    data?: PagedDataFineDto;
    error?: ApiErrorResponse;
};

