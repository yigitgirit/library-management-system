package me.seyrek.library_management_system.review.controller;

import lombok.RequiredArgsConstructor;
import me.seyrek.library_management_system.common.ApiResponse;
import me.seyrek.library_management_system.common.PagedData;
import me.seyrek.library_management_system.review.dto.ReviewDto;
import me.seyrek.library_management_system.review.service.ReviewService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import me.seyrek.library_management_system.security.utils.SecurityUtils;

@RestController
@RequestMapping("/api/books/{bookId}/reviews")
@RequiredArgsConstructor
public class BookReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ApiResponse<PagedData<ReviewDto>> getReviewsByBook(
            @PathVariable Long bookId,
            @ParameterObject @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        Page<ReviewDto> reviews = reviewService.getReviewsByBook(bookId, pageable);
        return ApiResponse.success(PagedData.of(reviews));
    }

    @GetMapping("/me")
    public ApiResponse<ReviewDto> getMyReviewForBook(@PathVariable Long bookId) {
        return ApiResponse.success(reviewService.getReviewByBookAndUser(bookId, SecurityUtils.getCurrentUserId()));
    }
}