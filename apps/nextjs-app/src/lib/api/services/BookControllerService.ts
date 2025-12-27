/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseBookDto } from '../models/ApiResponseBookDto';
import type { ApiResponsePagedDataBookDto } from '../models/ApiResponsePagedDataBookDto';
import type { BookSearchRequest } from '../models/BookSearchRequest';
import type { Pageable } from '../models/Pageable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BookControllerService {
    /**
     * @param request
     * @param pageable
     * @returns ApiResponsePagedDataBookDto OK
     * @throws ApiError
     */
    public static getAllBooks(
        request: BookSearchRequest,
        pageable: Pageable,
    ): CancelablePromise<ApiResponsePagedDataBookDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/books',
            query: {
                'request': request,
                'pageable': pageable,
            },
        });
    }
    /**
     * @param id
     * @returns ApiResponseBookDto OK
     * @throws ApiError
     */
    public static getBookById(
        id: number,
    ): CancelablePromise<ApiResponseBookDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/books/{id}',
            path: {
                'id': id,
            },
        });
    }
}
