/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseAuthorDto } from '../models/ApiResponseAuthorDto';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { AuthorCreateRequest } from '../models/AuthorCreateRequest';
import type { AuthorUpdateRequest } from '../models/AuthorUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthorManagementControllerService {
    /**
     * @returns ApiResponseAuthorDto OK
     * @throws ApiError
     */
    public static updateAuthor({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: AuthorUpdateRequest,
    }): CancelablePromise<ApiResponseAuthorDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/management/authors/{id}',
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
    public static deleteAuthor({
        id,
    }: {
        id: number,
    }): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/management/authors/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns ApiResponseAuthorDto Created
     * @throws ApiError
     */
    public static createAuthor({
        requestBody,
    }: {
        requestBody: AuthorCreateRequest,
    }): CancelablePromise<ApiResponseAuthorDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/management/authors',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
