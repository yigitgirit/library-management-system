/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseFineDto } from '../models/ApiResponseFineDto';
import type { ApiResponsePagedDataFineDto } from '../models/ApiResponsePagedDataFineDto';
import type { PaymentRequest } from '../models/PaymentRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FineControllerService {
    /**
     * @returns ApiResponseFineDto OK
     * @throws ApiError
     */
    public static payFine({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: PaymentRequest,
    }): CancelablePromise<ApiResponseFineDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/fines/{id}/pay',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ApiResponsePagedDataFineDto OK
     * @throws ApiError
     */
    public static getMyFines({
        status,
        page,
        size = 20,
        sort,
    }: {
        status?: 'UNPAID' | 'PAID' | 'WAIVED' | 'CANCELLED',
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
    }): CancelablePromise<ApiResponsePagedDataFineDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fines/my-fines',
            query: {
                'status': status,
                'page': page,
                'size': size,
                'sort': sort,
            },
        });
    }
}
