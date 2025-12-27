/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FinePatchRequest = {
    amount?: number;
    reason?: string;
    status?: FinePatchRequest.status;
};
export namespace FinePatchRequest {
    export enum status {
        UNPAID = 'UNPAID',
        PAID = 'PAID',
        WAIVED = 'WAIVED',
        CANCELLED = 'CANCELLED',
    }
}

