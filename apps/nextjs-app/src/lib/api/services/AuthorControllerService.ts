/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseAuthorDto } from '../models/ApiResponseAuthorDto';
import type { ApiResponsePagedDataAuthorDto } from '../models/ApiResponsePagedDataAuthorDto';
import type { Pageable } from '../models/Pageable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthorControllerService {
    /**
     * @param pageable
     * @param name
     * @returns ApiResponsePagedDataAuthorDto OK
     * @throws ApiError
     */
    public static getAllAuthors(
        pageable: Pageable,
        name?: string,
    ): CancelablePromise<ApiResponsePagedDataAuthorDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/authors',
            query: {
                'name': name,
                'pageable': pageable,
            },
        });
    }
    /**
     * @param id
     * @returns ApiResponseAuthorDto OK
     * @throws ApiError
     */
    public static getAuthorById(
        id: number,
    ): CancelablePromise<ApiResponseAuthorDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/authors/{id}',
            path: {
                'id': id,
            },
        });
    }
}
