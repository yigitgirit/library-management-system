/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseBookDto } from '../models/ApiResponseBookDto';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { BookCreateRequest } from '../models/BookCreateRequest';
import type { BookPatchRequest } from '../models/BookPatchRequest';
import type { BookUpdateRequest } from '../models/BookUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BookManagementControllerService {
    /**
     * @returns ApiResponseBookDto OK
     * @throws ApiError
     */
    public static updateBook({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: BookUpdateRequest,
    }): CancelablePromise<ApiResponseBookDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/management/books/{id}',
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
    public static deleteBook({
        id,
    }: {
        id: number,
    }): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/management/books/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns ApiResponseBookDto OK
     * @throws ApiError
     */
    public static patchBook({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: BookPatchRequest,
    }): CancelablePromise<ApiResponseBookDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/management/books/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ApiResponseBookDto Created
     * @throws ApiError
     */
    public static createBook({
        requestBody,
    }: {
        requestBody: BookCreateRequest,
    }): CancelablePromise<ApiResponseBookDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/management/books',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
