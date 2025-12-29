/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponsePagedDataUserDto } from '../models/ApiResponsePagedDataUserDto';
import type { ApiResponseUserDto } from '../models/ApiResponseUserDto';
import type { ApiResponseUserUpdateResponse } from '../models/ApiResponseUserUpdateResponse';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { UserBanRequest } from '../models/UserBanRequest';
import type { UserCreateRequest } from '../models/UserCreateRequest';
import type { UserUpdateRequest } from '../models/UserUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserManagementControllerService {
    /**
     * @returns ApiResponseUserDto OK
     * @throws ApiError
     */
    public static getUserById({
        id,
    }: {
        id: number,
    }): CancelablePromise<ApiResponseUserDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/management/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns ApiResponseUserUpdateResponse OK
     * @throws ApiError
     */
    public static updateUser({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: UserUpdateRequest,
    }): CancelablePromise<ApiResponseUserUpdateResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/management/users/{id}',
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
    public static deleteUser({
        id,
    }: {
        id: number,
    }): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/management/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns ApiResponsePagedDataUserDto OK
     * @throws ApiError
     */
    public static getAllUsers({
        page,
        size = 20,
        sort,
    }: {
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
    }): CancelablePromise<ApiResponsePagedDataUserDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/management/users',
            query: {
                'page': page,
                'size': size,
                'sort': sort,
            },
        });
    }
    /**
     * @returns ApiResponseUserDto Created
     * @throws ApiError
     */
    public static createUser({
        requestBody,
    }: {
        requestBody: UserCreateRequest,
    }): CancelablePromise<ApiResponseUserDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/management/users',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static unbanUser({
        id,
    }: {
        id: number,
    }): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/management/users/{id}/unban',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static banUser({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: UserBanRequest,
    }): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/management/users/{id}/ban',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
