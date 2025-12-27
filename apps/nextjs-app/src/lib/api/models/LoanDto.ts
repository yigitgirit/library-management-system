/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoanDto = {
    id?: number;
    userId?: number;
    userEmail?: string;
    copyId?: number;
    bookTitle?: string;
    bookIsbn?: string;
    bookCoverUrl?: string;
    status?: LoanDto.status;
    loanDate?: string;
    dueDate?: string;
    returnDate?: string;
    isOverdue?: boolean;
};
export namespace LoanDto {
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

