/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FineDto } from './FineDto';
export type LoanUserSummaryDto = {
    id?: number;
    bookTitle?: string;
    bookCoverUrl?: string;
    status?: LoanUserSummaryDto.status;
    loanDate?: string;
    dueDate?: string;
    returnDate?: string;
    isOverdue?: boolean;
    fines?: Array<FineDto>;
};
export namespace LoanUserSummaryDto {
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

