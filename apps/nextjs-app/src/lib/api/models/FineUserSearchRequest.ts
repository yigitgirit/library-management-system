/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FineUserSearchRequest = {
    status?: FineUserSearchRequest.status;
};
export namespace FineUserSearchRequest {
    export enum status {
        UNPAID = 'UNPAID',
        PAID = 'PAID',
        WAIVED = 'WAIVED',
        CANCELLED = 'CANCELLED',
    }
}

