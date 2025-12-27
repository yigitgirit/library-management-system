/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponsePagedDataUserDto } from '../models/ApiResponsePagedDataUserDto';
import type { ApiResponseUserDto } from '../models/ApiResponseUserDto';
import type { ApiResponseUserUpdateResponse } from '../models/ApiResponseUserUpdateResponse';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { Pageable } from '../models/Pageable';
import type { UserBanRequest } from '../models/UserBanRequest';
import type { UserCreateRequest } from '../models/UserCreateRequest';
import type { UserUpdateRequest } from '../models/UserUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserManagementControllerService {
    /**
     * @param id
     * @returns ApiResponseUserDto OK
     * @throws ApiError
     */
    public static getUserById(
        id: number,
    ): CancelablePromise<ApiResponseUserDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/management/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseUserUpdateResponse OK
     * @throws ApiError
     */
    public static updateUser(
        id: number,
        requestBody: UserUpdateRequest,
    ): CancelablePromise<ApiResponseUserUpdateResponse> {
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
     * @param id
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static deleteUser(
        id: number,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/management/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param pageable
     * @returns ApiResponsePagedDataUserDto OK
     * @throws ApiError
     */
    public static getAllUsers(
        pageable: Pageable,
    ): CancelablePromise<ApiResponsePagedDataUserDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/management/users',
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseUserDto Created
     * @throws ApiError
     */
    public static createUser(
        requestBody: UserCreateRequest,
    ): CancelablePromise<ApiResponseUserDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/management/users',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static unbanUser(
        id: number,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/management/users/{id}/unban',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static banUser(
        id: number,
        requestBody: UserBanRequest,
    ): CancelablePromise<ApiResponseVoid> {
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
