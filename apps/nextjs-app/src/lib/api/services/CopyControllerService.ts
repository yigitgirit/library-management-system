/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseCopyDto } from '../models/ApiResponseCopyDto';
import type { ApiResponsePagedDataCopyDto } from '../models/ApiResponsePagedDataCopyDto';
import type { CopySearchRequest } from '../models/CopySearchRequest';
import type { Pageable } from '../models/Pageable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CopyControllerService {
    /**
     * @returns ApiResponsePagedDataCopyDto OK
     * @throws ApiError
     */
    public static getAllCopies({
        request,
        pageable,
    }: {
        request: CopySearchRequest,
        pageable: Pageable,
    }): CancelablePromise<ApiResponsePagedDataCopyDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/copies',
            query: {
                'request': request,
                'pageable': pageable,
            },
        });
    }
    /**
     * @returns ApiResponseCopyDto OK
     * @throws ApiError
     */
    public static getCopyById({
        id,
    }: {
        id: number,
    }): CancelablePromise<ApiResponseCopyDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/copies/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns ApiResponseCopyDto OK
     * @throws ApiError
     */
    public static getCopyByBarcode({
        barcode,
    }: {
        barcode: string,
    }): CancelablePromise<ApiResponseCopyDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/copies/by-barcode/{barcode}',
            path: {
                'barcode': barcode,
            },
        });
    }
}
