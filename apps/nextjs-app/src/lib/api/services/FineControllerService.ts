/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseFineDto } from '../models/ApiResponseFineDto';
import type { ApiResponsePagedDataFineDto } from '../models/ApiResponsePagedDataFineDto';
import type { FineUserSearchRequest } from '../models/FineUserSearchRequest';
import type { Pageable } from '../models/Pageable';
import type { PaymentRequest } from '../models/PaymentRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FineControllerService {
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseFineDto OK
     * @throws ApiError
     */
    public static payFine(
        id: number,
        requestBody: PaymentRequest,
    ): CancelablePromise<ApiResponseFineDto> {
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
     * @param request
     * @param pageable
     * @returns ApiResponsePagedDataFineDto OK
     * @throws ApiError
     */
    public static getMyFines(
        request: FineUserSearchRequest,
        pageable: Pageable,
    ): CancelablePromise<ApiResponsePagedDataFineDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fines/my-fines',
            query: {
                'request': request,
                'pageable': pageable,
            },
        });
    }
}
