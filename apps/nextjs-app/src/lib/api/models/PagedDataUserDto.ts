/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageMetadata } from './PageMetadata';
import type { UserDto } from './UserDto';
/**
 * Wrapper for paged responses containing data and metadata
 */
export type PagedDataUserDto = {
    /**
     * List of items in the current page
     */
    content?: Array<UserDto>;
    /**
     * Pagination information
     */
    page?: PageMetadata;
};

