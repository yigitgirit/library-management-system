/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseLoanDetailDto } from '../models/ApiResponseLoanDetailDto';
import type { ApiResponsePagedDataLoanDto } from '../models/ApiResponsePagedDataLoanDto';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { LoanCreateRequest } from '../models/LoanCreateRequest';
import type { LoanPatchRequest } from '../models/LoanPatchRequest';
import type { LoanReportDamagedRequest } from '../models/LoanReportDamagedRequest';
import type { LoanSearchRequest } from '../models/LoanSearchRequest';
import type { LoanUpdateRequest } from '../models/LoanUpdateRequest';
import type { Pageable } from '../models/Pageable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LoanManagementControllerService {
    /**
     * @param id
     * @returns ApiResponseLoanDetailDto OK
     * @throws ApiError
     */
    public static getLoanById(
        id: number,
    ): CancelablePromise<ApiResponseLoanDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/management/loans/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseLoanDetailDto OK
     * @throws ApiError
     */
    public static updateLoan(
        id: number,
        requestBody: LoanUpdateRequest,
    ): CancelablePromise<ApiResponseLoanDetailDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/management/loans/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static deleteLoan(
        id: number,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/management/loans/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseLoanDetailDto OK
     * @throws ApiError
     */
    public static patchLoan(
        id: number,
        requestBody: LoanPatchRequest,
    ): CancelablePromise<ApiResponseLoanDetailDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/management/loans/{id}',
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
     * @returns ApiResponsePagedDataLoanDto OK
     * @throws ApiError
     */
    public static getAllLoans(
        request: LoanSearchRequest,
        pageable: Pageable,
    ): CancelablePromise<ApiResponsePagedDataLoanDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/management/loans',
            query: {
                'request': request,
                'pageable': pageable,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseLoanDetailDto Created
     * @throws ApiError
     */
    public static createLoan(
        requestBody: LoanCreateRequest,
    ): CancelablePromise<ApiResponseLoanDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/management/loans',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns ApiResponseLoanDetailDto OK
     * @throws ApiError
     */
    public static returnLoan(
        id: number,
    ): CancelablePromise<ApiResponseLoanDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/management/loans/{id}/return',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns ApiResponseLoanDetailDto OK
     * @throws ApiError
     */
    public static reportLost(
        id: number,
    ): CancelablePromise<ApiResponseLoanDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/management/loans/{id}/report-lost',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseLoanDetailDto OK
     * @throws ApiError
     */
    public static reportDamaged(
        id: number,
        requestBody: LoanReportDamagedRequest,
    ): CancelablePromise<ApiResponseLoanDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/management/loans/{id}/report-damaged',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
