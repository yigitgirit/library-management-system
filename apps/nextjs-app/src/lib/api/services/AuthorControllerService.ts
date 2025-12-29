/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseAuthorDto } from '../models/ApiResponseAuthorDto';
import type { ApiResponsePagedDataAuthorDto } from '../models/ApiResponsePagedDataAuthorDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthorControllerService {
    /**
     * @returns ApiResponsePagedDataAuthorDto OK
     * @throws ApiError
     */
    public static getAllAuthors({
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
    }): CancelablePromise<ApiResponsePagedDataAuthorDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/authors',
            query: {
                'name': name,
                'page': page,
                'size': size,
                'sort': sort,
            },
        });
    }
    /**
     * @returns ApiResponseAuthorDto OK
     * @throws ApiError
     */
    public static getAuthorById({
        id,
    }: {
        id: number,
    }): CancelablePromise<ApiResponseAuthorDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/authors/{id}',
            path: {
                'id': id,
            },
        });
    }
}
