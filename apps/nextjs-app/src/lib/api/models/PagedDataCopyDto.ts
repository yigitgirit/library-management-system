/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CopyDto } from './CopyDto';
import type { PageMetadata } from './PageMetadata';
/**
 * Wrapper for paged responses containing data and metadata
 */
export type PagedDataCopyDto = {
    /**
     * List of items in the current page
     */
    content?: Array<CopyDto>;
    /**
     * Pagination information
     */
    page?: PageMetadata;
};

