/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseBookDto } from '../models/ApiResponseBookDto';
import type { ApiResponsePagedDataBookDto } from '../models/ApiResponsePagedDataBookDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BookControllerService {
    /**
     * Get all books with pagination and filtering
     * @returns ApiResponsePagedDataBookDto OK
     * @throws ApiError
     */
    public static getAllBooks({
        search,
        isbn,
        title,
        authorName,
        categoryIds,
        minPrice,
        maxPrice,
        available,
        page,
        size = 20,
        sort,
    }: {
        search?: string,
        isbn?: string,
        title?: string,
        authorName?: string,
        categoryIds?: Array<number>,
        minPrice?: number,
        maxPrice?: number,
        available?: boolean,
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
    }): CancelablePromise<ApiResponsePagedDataBookDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/books',
            query: {
                'search': search,
                'isbn': isbn,
                'title': title,
                'authorName': authorName,
                'categoryIds': categoryIds,
                'minPrice': minPrice,
                'maxPrice': maxPrice,
                'available': available,
                'page': page,
                'size': size,
                'sort': sort,
            },
        });
    }
    /**
     * @returns ApiResponseBookDto OK
     * @throws ApiError
     */
    public static getBookById({
        id,
    }: {
        id: number,
    }): CancelablePromise<ApiResponseBookDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/books/{id}',
            path: {
                'id': id,
            },
        });
    }
}
