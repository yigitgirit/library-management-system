/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FineDto } from './FineDto';
import type { PageMetadata } from './PageMetadata';
/**
 * Wrapper for paged responses containing data and metadata
 */
export type PagedDataFineDto = {
    /**
     * List of items in the current page
     */
    content?: Array<FineDto>;
    /**
     * Pagination information
     */
    page?: PageMetadata;
};

