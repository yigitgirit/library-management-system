package me.seyrek.library_management_system.review.controller;

import jakarta.validation.Valid;
import me.seyrek.library_management_system.common.ApiResponse;
import me.seyrek.library_management_system.common.PagedData;
import me.seyrek.library_management_system.review.dto.ReviewDto;
import me.seyrek.library_management_system.review.dto.ReviewPatchRequest;
import me.seyrek.library_management_system.review.dto.ReviewSearchRequest;
import me.seyrek.library_management_system.review.dto.ReviewUpdateRequest;
import me.seyrek.library_management_system.review.service.ReviewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/management/reviews")
public class ReviewManagementController {

    private final ReviewService reviewService;

    public ReviewManagementController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ApiResponse<PagedData<ReviewDto>> getAllReviews(
            ReviewSearchRequest request,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        Page<ReviewDto> reviews = reviewService.getAllReviews(request, pageable);
        return ApiResponse.success(PagedData.of(reviews));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ApiResponse<ReviewDto> getReviewById(@PathVariable Long id) {
        return ApiResponse.success(reviewService.getReviewById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ReviewDto> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewUpdateRequest request
    ) {
        return ApiResponse.success(reviewService.updateReviewAsAdmin(id, request));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ReviewDto> patchReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewPatchRequest request
    ) {
        return ApiResponse.success(reviewService.patchReviewAsAdmin(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReviewAsAdmin(id);
        return ApiResponse.success("Review with ID " + id + " has been successfully deleted");
    }
}