/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoanUserSummaryDto } from './LoanUserSummaryDto';
import type { PageMetadata } from './PageMetadata';
/**
 * Wrapper for paged responses containing data and metadata
 */
export type PagedDataLoanUserSummaryDto = {
    /**
     * List of items in the current page
     */
    content?: Array<LoanUserSummaryDto>;
    /**
     * Pagination information
     */
    page?: PageMetadata;
};

