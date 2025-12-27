/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoanDto } from './LoanDto';
import type { PageMetadata } from './PageMetadata';
/**
 * Wrapper for paged responses containing data and metadata
 */
export type PagedDataLoanDto = {
    /**
     * List of items in the current page
     */
    content?: Array<LoanDto>;
    /**
     * Pagination information
     */
    page?: PageMetadata;
};

