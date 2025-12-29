/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseUserEditProfileResponse } from '../models/ApiResponseUserEditProfileResponse';
import type { ApiResponseUserPrivateProfile } from '../models/ApiResponseUserPrivateProfile';
import type { ApiResponseUserPublicProfile } from '../models/ApiResponseUserPublicProfile';
import type { UserEditProfileRequest } from '../models/UserEditProfileRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserControllerService {
    /**
     * @returns ApiResponseUserPrivateProfile OK
     * @throws ApiError
     */
    public static getMyProfile(): CancelablePromise<ApiResponseUserPrivateProfile> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/me',
        });
    }
    /**
     * @returns ApiResponseUserEditProfileResponse OK
     * @throws ApiError
     */
    public static editMyProfile({
        requestBody,
    }: {
        requestBody: UserEditProfileRequest,
    }): CancelablePromise<ApiResponseUserEditProfileResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/users/me',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ApiResponseUserPublicProfile OK
     * @throws ApiError
     */
    public static getUserPublicProfile({
        id,
    }: {
        id: number,
    }): CancelablePromise<ApiResponseUserPublicProfile> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
        });
    }
}
