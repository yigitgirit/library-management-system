/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponsePagedDataLoanUserSummaryDto } from '../models/ApiResponsePagedDataLoanUserSummaryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LoanControllerService {
    /**
     * @returns ApiResponsePagedDataLoanUserSummaryDto OK
     * @throws ApiError
     */
    public static getMyLoans({
        bookTitle,
        isbn,
        status,
        overdue,
        page,
        size = 20,
        sort,
    }: {
        bookTitle?: string,
        isbn?: string,
        status?: 'ACTIVE' | 'OVERDUE' | 'RETURNED' | 'RETURNED_OVERDUE' | 'RETURNED_DAMAGED' | 'LOST' | 'CANCELLED',
        overdue?: boolean,
        /**
         * Zero-based page index (0..N)
         */
        page?: number,
        /**
         * The size of the page to be returned
         */
        size?: number,
        /**
         * Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
         */
        sort?: Array<string>,
    }): CancelablePromise<ApiResponsePagedDataLoanUserSummaryDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/loans/my-loans',
            query: {
                'bookTitle': bookTitle,
                'isbn': isbn,
                'status': status,
                'overdue': overdue,
                'page': page,
                'size': size,
                'sort': sort,
            },
        });
    }
}
