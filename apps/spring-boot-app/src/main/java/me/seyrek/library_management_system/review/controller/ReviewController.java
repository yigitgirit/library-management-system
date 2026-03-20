package me.seyrek.library_management_system.review.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.seyrek.library_management_system.common.ApiResponse;
import me.seyrek.library_management_system.common.PagedData;
import me.seyrek.library_management_system.review.dto.ReviewCreateRequest;
import me.seyrek.library_management_system.review.dto.ReviewDto;
import me.seyrek.library_management_system.review.dto.ReviewUpdateRequest;
import me.seyrek.library_management_system.review.service.ReviewService;
import me.seyrek.library_management_system.security.utils.SecurityUtils;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ReviewDto> createReview(@Valid @RequestBody ReviewCreateRequest request) {
        ReviewDto review = reviewService.createReview(SecurityUtils.getCurrentUserId(), request);
        return ApiResponse.success(review);
    }

    @PutMapping("/{id}")
    public ApiResponse<ReviewDto> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewUpdateRequest request) {
        ReviewDto review = reviewService.updateReview(id, SecurityUtils.getCurrentUserId(), request);
        return ApiResponse.success(review);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id, SecurityUtils.getCurrentUserId());
    }

    @GetMapping("/my-reviews")
    public ApiResponse<PagedData<ReviewDto>> getMyReviews(
            @ParameterObject @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        Page<ReviewDto> reviews = reviewService.getReviewsByUser(SecurityUtils.getCurrentUserId(), pageable);
        return ApiResponse.success(PagedData.of(reviews));
    }

    @GetMapping("/{id}")
    public ApiResponse<ReviewDto> getReviewById(@PathVariable Long id) {
        return ApiResponse.success(reviewService.getReviewById(id));
    }
}