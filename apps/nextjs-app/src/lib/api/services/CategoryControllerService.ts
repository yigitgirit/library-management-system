/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseCategoryDto } from '../models/ApiResponseCategoryDto';
import type { ApiResponsePagedDataCategoryDto } from '../models/ApiResponsePagedDataCategoryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoryControllerService {
    /**
     * @returns ApiResponsePagedDataCategoryDto OK
     * @throws ApiError
     */
    public static getCategories({
        name,
        page,
        size = 20,
        sort,
    }: {
        name?: string,
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
    }): CancelablePromise<ApiResponsePagedDataCategoryDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/categories',
            query: {
                'name': name,
                'page': page,
                'size': size,
                'sort': sort,
            },
        });
    }
    /**
     * @returns ApiResponseCategoryDto OK
     * @throws ApiError
     */
    public static getCategoryById({
        id,
    }: {
        id: number,
    }): CancelablePromise<ApiResponseCategoryDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/categories/{id}',
            path: {
                'id': id,
            },
        });
    }
}
