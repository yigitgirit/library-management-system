package me.seyrek.library_management_system.review.service;

import me.seyrek.library_management_system.review.dto.ReviewCreateRequest;
import me.seyrek.library_management_system.review.dto.ReviewDto;
import me.seyrek.library_management_system.review.dto.ReviewPatchRequest;
import me.seyrek.library_management_system.review.dto.ReviewSearchRequest;
import me.seyrek.library_management_system.review.dto.ReviewUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    Page<ReviewDto> getAllReviews(ReviewSearchRequest request, Pageable pageable);
    ReviewDto createReview(Long userId, ReviewCreateRequest request);
    ReviewDto updateReview(Long id, Long userId, ReviewUpdateRequest request);
    ReviewDto updateReviewAsAdmin(Long id, ReviewUpdateRequest request);
    ReviewDto patchReviewAsAdmin(Long id, ReviewPatchRequest request);
    void deleteReview(Long id, Long userId);
    void deleteReviewAsAdmin(Long id);
    Page<ReviewDto> getReviewsByBook(Long bookId, Pageable pageable);
    Page<ReviewDto> getReviewsByUser(Long userId, Pageable pageable);
    ReviewDto getReviewById(Long id);
    ReviewDto getReviewByBookAndUser(Long bookId, Long userId);
}