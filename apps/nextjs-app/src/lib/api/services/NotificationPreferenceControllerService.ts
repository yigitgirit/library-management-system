/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListUserNotificationPreferenceDto } from '../models/ApiResponseListUserNotificationPreferenceDto';
import type { ApiResponseUserNotificationPreferenceDto } from '../models/ApiResponseUserNotificationPreferenceDto';
import type { UpdateNotificationPreferenceRequest } from '../models/UpdateNotificationPreferenceRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationPreferenceControllerService {
    /**
     * @returns ApiResponseListUserNotificationPreferenceDto OK
     * @throws ApiError
     */
    public static getMyPreferences(): CancelablePromise<ApiResponseListUserNotificationPreferenceDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notification-preferences',
        });
    }
    /**
     * @returns ApiResponseUserNotificationPreferenceDto OK
     * @throws ApiError
     */
    public static updatePreference({
        requestBody,
    }: {
        requestBody: UpdateNotificationPreferenceRequest,
    }): CancelablePromise<ApiResponseUserNotificationPreferenceDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/notification-preferences',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
