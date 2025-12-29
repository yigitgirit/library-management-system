/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FineDto } from './FineDto';
export type LoanDetailDto = {
    id?: number;
    userId?: number;
    userFirstName?: string;
    userLastName?: string;
    userEmail?: string;
    copyId?: number;
    copyBarcode?: string;
    bookTitle?: string;
    bookIsbn?: string;
    bookCoverUrl?: string;
    status?: LoanDetailDto.status;
    loanDate?: string;
    dueDate?: string;
    returnDate?: string;
    isOverdue?: boolean;
    fines?: Array<FineDto>;
};
export namespace LoanDetailDto {
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

