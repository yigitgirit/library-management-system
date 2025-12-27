/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseCategoryDto } from '../models/ApiResponseCategoryDto';
import type { ApiResponsePagedDataCategoryDto } from '../models/ApiResponsePagedDataCategoryDto';
import type { Pageable } from '../models/Pageable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoryControllerService {
    /**
     * @param pageable
     * @param name
     * @returns ApiResponsePagedDataCategoryDto OK
     * @throws ApiError
     */
    public static getCategories(
        pageable: Pageable,
        name?: string,
    ): CancelablePromise<ApiResponsePagedDataCategoryDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/categories',
            query: {
                'name': name,
                'pageable': pageable,
            },
        });
    }
    /**
     * @param id
     * @returns ApiResponseCategoryDto OK
     * @throws ApiError
     */
    public static getCategoryById(
        id: number,
    ): CancelablePromise<ApiResponseCategoryDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/categories/{id}',
            path: {
                'id': id,
            },
        });
    }
}
