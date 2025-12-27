/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FineSearchRequest = {
    userId?: number;
    userEmail?: string;
    loanId?: number;
    bookId?: number;
    status?: FineSearchRequest.status;
    minAmount?: number;
    maxAmount?: number;
    fineDateStart?: string;
    fineDateEnd?: string;
    paymentDateStart?: string;
    paymentDateEnd?: string;
};
export namespace FineSearchRequest {
    export enum status {
        UNPAID = 'UNPAID',
        PAID = 'PAID',
        WAIVED = 'WAIVED',
        CANCELLED = 'CANCELLED',
    }
}

