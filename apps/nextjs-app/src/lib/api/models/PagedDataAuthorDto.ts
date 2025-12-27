/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthorDto } from './AuthorDto';
import type { PageMetadata } from './PageMetadata';
/**
 * Wrapper for paged responses containing data and metadata
 */
export type PagedDataAuthorDto = {
    /**
     * List of items in the current page
     */
    content?: Array<AuthorDto>;
    /**
     * Pagination information
     */
    page?: PageMetadata;
};

