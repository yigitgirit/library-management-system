/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiErrorResponse } from './ApiErrorResponse';
import type { PagedDataLoanDto } from './PagedDataLoanDto';
export type ApiResponsePagedDataLoanDto = {
    success?: boolean;
    timestamp?: string;
    message?: string;
    data?: PagedDataLoanDto;
    error?: ApiErrorResponse;
};

