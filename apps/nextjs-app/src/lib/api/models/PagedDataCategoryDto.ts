/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryDto } from './CategoryDto';
import type { PageMetadata } from './PageMetadata';
/**
 * Wrapper for paged responses containing data and metadata
 */
export type PagedDataCategoryDto = {
    /**
     * List of items in the current page
     */
    content?: Array<CategoryDto>;
    /**
     * Pagination information
     */
    page?: PageMetadata;
};

