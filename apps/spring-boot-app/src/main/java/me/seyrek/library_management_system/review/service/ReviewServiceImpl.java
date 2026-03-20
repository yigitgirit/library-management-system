package me.seyrek.library_management_system.review.service;

import lombok.RequiredArgsConstructor;
import me.seyrek.library_management_system.book.model.Book;
import me.seyrek.library_management_system.book.repository.BookRepository;
import me.seyrek.library_management_system.exception.ErrorCode;
import me.seyrek.library_management_system.exception.client.BusinessException;
import me.seyrek.library_management_system.exception.client.DuplicateResourceException;
import me.seyrek.library_management_system.exception.client.ResourceNotFoundException;
import me.seyrek.library_management_system.review.dto.ReviewCreateRequest;
import me.seyrek.library_management_system.review.dto.ReviewDto;
import me.seyrek.library_management_system.review.dto.ReviewPatchRequest;
import me.seyrek.library_management_system.review.dto.ReviewSearchRequest;
import me.seyrek.library_management_system.review.dto.ReviewUpdateRequest;
import me.seyrek.library_management_system.review.mapper.ReviewMapper;
import me.seyrek.library_management_system.review.model.Review;
import me.seyrek.library_management_system.review.repository.ReviewRepository;
import me.seyrek.library_management_system.review.repository.ReviewSpecification;
import me.seyrek.library_management_system.user.model.User;
import me.seyrek.library_management_system.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewDto> getAllReviews(ReviewSearchRequest request, Pageable pageable) {
        return reviewRepository.findAll(ReviewSpecification.withDynamicQuery(request), pageable)
                .map(reviewMapper::toReviewDto);
    }

    @Override
    @Transactional
    public ReviewDto createReview(Long userId, ReviewCreateRequest request) {
        if (reviewRepository.existsByBookIdAndUserId(request.bookId(), userId)) {
            throw new DuplicateResourceException("User has already reviewed this book", ErrorCode.DATA_INTEGRITY_VIOLATION);
        }

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found", ErrorCode.BOOK_NOT_FOUND));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", ErrorCode.USER_NOT_FOUND));

        Review review = reviewMapper.fromReviewCreateRequest(request);
        review.setBook(book);
        review.setUser(user);

        Review savedReview = reviewRepository.save(review);
        return reviewMapper.toReviewDto(savedReview);
    }

    @Override
    @Transactional
    public ReviewDto updateReview(Long id, Long userId, ReviewUpdateRequest request) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found", ErrorCode.RESOURCE_NOT_FOUND));

        if (!review.getUser().getId().equals(userId)) {
            throw new BusinessException("You are not authorized to update this review", ErrorCode.FORBIDDEN);
        }

        reviewMapper.updateReviewFromRequest(request, review);
        Review updatedReview = reviewRepository.save(review);
        return reviewMapper.toReviewDto(updatedReview);
    }

    @Override
    @Transactional
    public ReviewDto updateReviewAsAdmin(Long id, ReviewUpdateRequest request) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found", ErrorCode.RESOURCE_NOT_FOUND));

        reviewMapper.updateReviewFromRequest(request, review);
        Review updatedReview = reviewRepository.save(review);
        return reviewMapper.toReviewDto(updatedReview);
    }

    @Override
    @Transactional
    public ReviewDto patchReviewAsAdmin(Long id, ReviewPatchRequest request) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found", ErrorCode.RESOURCE_NOT_FOUND));

        reviewMapper.patchReviewFromRequest(request, review);
        Review updatedReview = reviewRepository.save(review);
        return reviewMapper.toReviewDto(updatedReview);
    }

    @Override
    @Transactional
    public void deleteReview(Long id, Long userId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found", ErrorCode.RESOURCE_NOT_FOUND));

        if (!review.getUser().getId().equals(userId)) {
            throw new BusinessException("You are not authorized to delete this review", ErrorCode.FORBIDDEN);
        }

        reviewRepository.delete(review);
    }

    @Override
    @Transactional
    public void deleteReviewAsAdmin(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found", ErrorCode.RESOURCE_NOT_FOUND));
        
        reviewRepository.delete(review);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewDto> getReviewsByBook(Long bookId, Pageable pageable) {
        if (!bookRepository.existsById(bookId)) {
            throw new ResourceNotFoundException("Book not found", ErrorCode.BOOK_NOT_FOUND);
        }
        return reviewRepository.findByBookId(bookId, pageable)
                .map(reviewMapper::toReviewDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewDto> getReviewsByUser(Long userId, Pageable pageable) {
        return reviewRepository.findByUserId(userId, pageable)
                .map(reviewMapper::toReviewDto);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewDto getReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found", ErrorCode.RESOURCE_NOT_FOUND));
        return reviewMapper.toReviewDto(review);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewDto getReviewByBookAndUser(Long bookId, Long userId) {
        return reviewRepository.findByBookIdAndUserId(bookId, userId)
                .map(reviewMapper::toReviewDto)
                .orElse(null);
    }
}