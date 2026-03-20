package me.seyrek.library_management_system.loan.repository;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import me.seyrek.library_management_system.book.model.Book;
import me.seyrek.library_management_system.copy.model.Copy;
import me.seyrek.library_management_system.loan.dto.LoanSearchRequest;
import me.seyrek.library_management_system.loan.model.Loan;
import me.seyrek.library_management_system.loan.model.LoanStatus;
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
public final class LoanSpecification {

    private LoanSpecification() {
        // Utility class
    }

    public static Specification<Loan> withDynamicQuery(LoanSearchRequest request) {
        return Specification.allOf(Arrays.asList(
                hasUserId(request.userId()),
                hasUserEmail(request.userEmail()),
                hasCopyId(request.copyId()),
                hasBarcode(request.barcode()),
                hasBookId(request.bookId()),
                hasBookTitle(request.bookTitle()),
                hasIsbn(request.isbn()),
                hasStatus(request.status()),
                isOverdue(request.overdue()),
                dateGreaterThanOrEqualTo("loanDate", request.loanDateStart()),
                dateLessThanOrEqualTo("loanDate", request.loanDateEnd()),
                dateGreaterThanOrEqualTo("dueDate", request.dueDateStart()),
                dateLessThanOrEqualTo("dueDate", request.dueDateEnd()),
                dateGreaterThanOrEqualTo("returnDate", request.returnDateStart()),
                dateLessThanOrEqualTo("returnDate", request.returnDateEnd())
        ));
    }

    // -----------------------------------------------------------------
    // USER SPECIFICATIONS
    // -----------------------------------------------------------------
    private static Specification<Loan> hasUserId(Long userId) {
        if (userId == null) return null;
        return (root, query, cb) -> {
            Join<Loan, User> user = getOrCreateJoin(root, "user", JoinType.INNER);
            return cb.equal(user.get("id"), userId);
        };
    }

    private static Specification<Loan> hasUserEmail(String email) {
        if (!StringUtils.hasText(email)) return null;
        return (root, query, cb) -> {
            Join<Loan, User> user = getOrCreateJoin(root, "user", JoinType.INNER);
            return cb.like(cb.lower(user.get("email")), "%" + email.toLowerCase() + "%");
        };
    }

    // -----------------------------------------------------------------
    // COPY & BOOK SPECIFICATIONS
    // -----------------------------------------------------------------
    private static Specification<Loan> hasCopyId(Long copyId) {
        if (copyId == null) return null;
        return (root, query, cb) -> {
            Join<Loan, Copy> copy = getOrCreateJoin(root, "copy", JoinType.INNER);
            return cb.equal(copy.get("id"), copyId);
        };
    }

    private static Specification<Loan> hasBarcode(String barcode) {
        if (!StringUtils.hasText(barcode)) return null;
        return (root, query, cb) -> {
            Join<Loan, Copy> copy = getOrCreateJoin(root, "copy", JoinType.INNER);
            return cb.like(copy.get("barcode"), "%" + barcode + "%");
        };
    }

    private static Specification<Loan> hasBookId(Long bookId) {
        if (bookId == null) return null;
        return (root, query, cb) -> {
            Join<Loan, Copy> copy = getOrCreateJoin(root, "copy", JoinType.INNER);
            Join<Copy, Book> book = getOrCreateJoin(copy, "book", JoinType.INNER);
            return cb.equal(book.get("id"), bookId);
        };
    }

    private static Specification<Loan> hasBookTitle(String title) {
        if (!StringUtils.hasText(title)) return null;
        return (root, query, cb) -> {
            Join<Loan, Copy> copy = getOrCreateJoin(root, "copy", JoinType.INNER);
            Join<Copy, Book> book = getOrCreateJoin(copy, "book", JoinType.INNER);
            return cb.like(cb.lower(book.get("title")), "%" + title.toLowerCase() + "%");
        };
    }

    private static Specification<Loan> hasIsbn(String isbn) {
        if (!StringUtils.hasText(isbn)) return null;
        return (root, query, cb) -> {
            Join<Loan, Copy> copy = getOrCreateJoin(root, "copy", JoinType.INNER);
            Join<Copy, Book> book = getOrCreateJoin(copy, "book", JoinType.INNER);
            return cb.like(book.get("isbn"), "%" + isbn + "%");
        };
    }

    // -----------------------------------------------------------------
    // LOAN STATUS & DATE SPECIFICATIONS
    // -----------------------------------------------------------------
    private static Specification<Loan> hasStatus(LoanStatus status) {
        if (status == null) return null;
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    private static Specification<Loan> isOverdue(Boolean overdue) {
        if (overdue == null || !overdue) return null;
        return (root, query, cb) -> cb.and(
                cb.equal(root.get("status"), LoanStatus.ACTIVE),
                cb.lessThan(root.get("dueDate"), Instant.now())
        );
    }

    private static Specification<Loan> dateGreaterThanOrEqualTo(String attribute, Instant date) {
        if (date == null) return null;
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get(attribute), date);
    }

    private static Specification<Loan> dateLessThanOrEqualTo(String attribute, Instant date) {
        if (date == null) return null;
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get(attribute), date);
    }
}