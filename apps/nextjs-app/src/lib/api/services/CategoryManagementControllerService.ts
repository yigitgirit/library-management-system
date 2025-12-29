/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseCategoryDto } from '../models/ApiResponseCategoryDto';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { CategoryCreateRequest } from '../models/CategoryCreateRequest';
import type { CategoryUpdateRequest } from '../models/CategoryUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoryManagementControllerService {
    /**
     * @returns ApiResponseCategoryDto OK
     * @throws ApiError
     */
    public static updateCategory({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: CategoryUpdateRequest,
    }): CancelablePromise<ApiResponseCategoryDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/management/categories/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static deleteCategory({
        id,
    }: {
        id: number,
    }): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/management/categories/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns ApiResponseCategoryDto Created
     * @throws ApiError
     */
    public static createCategory({
        requestBody,
    }: {
        requestBody: CategoryCreateRequest,
    }): CancelablePromise<ApiResponseCategoryDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/management/categories',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
