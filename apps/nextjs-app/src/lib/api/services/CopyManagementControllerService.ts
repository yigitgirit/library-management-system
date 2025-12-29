/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseCopyDto } from '../models/ApiResponseCopyDto';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { CopyCreateRequest } from '../models/CopyCreateRequest';
import type { CopyPatchRequest } from '../models/CopyPatchRequest';
import type { CopyUpdateRequest } from '../models/CopyUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CopyManagementControllerService {
    /**
     * @returns ApiResponseCopyDto OK
     * @throws ApiError
     */
    public static updateCopy({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: CopyUpdateRequest,
    }): CancelablePromise<ApiResponseCopyDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/management/copies/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ApiResponseCopyDto OK
     * @throws ApiError
     */
    public static patchCopy({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: CopyPatchRequest,
    }): CancelablePromise<ApiResponseCopyDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/management/copies/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ApiResponseCopyDto Created
     * @throws ApiError
     */
    public static createCopy({
        requestBody,
    }: {
        requestBody: CopyCreateRequest,
    }): CancelablePromise<ApiResponseCopyDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/management/copies',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static retireCopy({
        id,
    }: {
        id: number,
    }): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/management/copies/{id}/retire',
            path: {
                'id': id,
            },
        });
    }
}
