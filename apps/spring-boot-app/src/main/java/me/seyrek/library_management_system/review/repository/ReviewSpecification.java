package me.seyrek.library_management_system.review.repository;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import me.seyrek.library_management_system.book.model.Book;
import me.seyrek.library_management_system.review.dto.ReviewSearchRequest;
import me.seyrek.library_management_system.review.model.Review;
import me.seyrek.library_management_system.user.model.User;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.Arrays;

import static me.seyrek.library_management_system.common.repository.SpecificationUtils.getOrCreateJoin;

/**
 * Implements JPA Specification API for dynamic query construction.
 * Allows complex filtering (AND/OR criteria) directly on the database level
 * without loading unnecessary data into memory.
 */
public final class ReviewSpecification {

    private ReviewSpecification() {
        // Utility class
    }

    public static Specification<Review> withDynamicQuery(ReviewSearchRequest request) {
        return Specification.allOf(Arrays.asList(
                hasUserId(request.userId()),
                hasUserEmail(request.userEmail()),
                hasBookId(request.bookId()),
                hasBookTitle(request.bookTitle()),
                hasIsbn(request.isbn()),
                hasRating(request.rating()),
                dateGreaterThanOrEqualTo("createdAt", request.createdDateStart()),
                dateLessThanOrEqualTo("createdAt", request.createdDateEnd())
        ));
    }

    // -----------------------------------------------------------------
    // USER SPECIFICATIONS
    // -----------------------------------------------------------------
    private static Specification<Review> hasUserId(Long userId) {
        if (userId == null) return null;
        return (root, query, cb) -> {
            Join<Review, User> user = getOrCreateJoin(root, "user", JoinType.INNER);
            return cb.equal(user.get("id"), userId);
        };
    }

    private static Specification<Review> hasUserEmail(String email) {
        if (!StringUtils.hasText(email)) return null;
        return (root, query, cb) -> {
            Join<Review, User> user = getOrCreateJoin(root, "user", JoinType.INNER);
            return cb.like(cb.lower(user.get("email")), "%" + email.toLowerCase() + "%");
        };
    }

    // -----------------------------------------------------------------
    // BOOK SPECIFICATIONS
    // -----------------------------------------------------------------
    private static Specification<Review> hasBookId(Long bookId) {
        if (bookId == null) return null;
        return (root, query, cb) -> {
            Join<Review, Book> book = getOrCreateJoin(root, "book", JoinType.INNER);
            return cb.equal(book.get("id"), bookId);
        };
    }

    private static Specification<Review> hasBookTitle(String title) {
        if (!StringUtils.hasText(title)) return null;
        return (root, query, cb) -> {
            Join<Review, Book> book = getOrCreateJoin(root, "book", JoinType.INNER);
            return cb.like(cb.lower(book.get("title")), "%" + title.toLowerCase() + "%");
        };
    }

    private static Specification<Review> hasIsbn(String isbn) {
        if (!StringUtils.hasText(isbn)) return null;
        return (root, query, cb) -> {
            Join<Review, Book> book = getOrCreateJoin(root, "book", JoinType.INNER);
            return cb.like(book.get("isbn"), "%" + isbn + "%");
        };
    }

    // -----------------------------------------------------------------
    // REVIEW SPECIFICATIONS
    // -----------------------------------------------------------------
    private static Specification<Review> hasRating(Integer rating) {
        if (rating == null) return null;
        return (root, query, cb) -> cb.equal(root.get("rating"), rating);
    }

    private static Specification<Review> dateGreaterThanOrEqualTo(String attribute, Instant date) {
        if (date == null) return null;
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get(attribute), date);
    }

    private static Specification<Review> dateLessThanOrEqualTo(String attribute, Instant date) {
        if (date == null) return null;
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get(attribute), date);
    }
}