/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoanSearchRequest = {
    userId?: number;
    userEmail?: string;
    copyId?: number;
    barcode?: string;
    bookId?: number;
    isbn?: string;
    bookTitle?: string;
    status?: LoanSearchRequest.status;
    overdue?: boolean;
    loanDateStart?: string;
    loanDateEnd?: string;
    dueDateStart?: string;
    dueDateEnd?: string;
    returnDateStart?: string;
    returnDateEnd?: string;
};
export namespace LoanSearchRequest {
    export enum status {
        ACTIVE = 'ACTIVE',
        OVERDUE = 'OVERDUE',
        RETURNED = 'RETURNED',
        RETURNED_OVERDUE = 'RETURNED_OVERDUE',
        RETURNED_DAMAGED = 'RETURNED_DAMAGED',
        LOST = 'LOST',
        CANCELLED = 'CANCELLED',
    }
}

