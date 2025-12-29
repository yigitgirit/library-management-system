/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FineDto = {
    id?: number;
    userId?: number;
    userEmail?: string;
    loanId?: number;
    amount?: number;
    reason?: string;
    status?: FineDto.status;
    fineDate?: string;
    paymentDate?: string;
    createdAt?: string;
    updatedAt?: string;
};
export namespace FineDto {
    export enum status {
        UNPAID = 'UNPAID',
        PAID = 'PAID',
        WAIVED = 'WAIVED',
        CANCELLED = 'CANCELLED',
    }
}

