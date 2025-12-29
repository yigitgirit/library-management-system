/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookDto } from './BookDto';
import type { PageMetadata } from './PageMetadata';
/**
 * Wrapper for paged responses containing data and metadata
 */
export type PagedDataBookDto = {
    /**
     * List of items in the current page
     */
    content?: Array<BookDto>;
    /**
     * Pagination information
     */
    page?: PageMetadata;
};

