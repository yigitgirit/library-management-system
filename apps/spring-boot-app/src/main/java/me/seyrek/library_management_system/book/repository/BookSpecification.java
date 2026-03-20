package me.seyrek.library_management_system.book.repository;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import me.seyrek.library_management_system.author.model.Author;
import me.seyrek.library_management_system.book.dto.BookSearchRequest;
import me.seyrek.library_management_system.book.model.Book;
import me.seyrek.library_management_system.category.model.Category;
import me.seyrek.library_management_system.copy.model.Copy;
import me.seyrek.library_management_system.copy.model.CopyStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static me.seyrek.library_management_system.common.repository.SpecificationUtils.getOrCreateJoin;

/**
 * Implements JPA Specification API for dynamic query construction.
 * Allows complex filtering (AND/OR criteria) directly on the database level
 * without loading unnecessary data into memory.
 */
public final class BookSpecification {

    private BookSpecification() {
        // Utility class
    }

    public static Specification<Book> withDynamicQuery(BookSearchRequest request) {
        return (root, query, cb) -> {
            Specification<Book> filterSpec = Specification.allOf(Arrays.asList(
                    hasCategoryIds(request.categoryIds()),
                    hasMinPrice(request.minPrice()),
                    hasMaxPrice(request.maxPrice()),
                    hasAvailableCopies(request.available())
            ));

            if (StringUtils.hasText(request.search())) {
                filterSpec = filterSpec.and(Specification.anyOf(Arrays.asList(
                        hasTitle(request.search()),
                        hasIsbn(request.search()),
                        hasAuthorName(request.search())
                )));
            } else {
                filterSpec = filterSpec.and(Specification.allOf(Arrays.asList(
                        hasTitle(request.title()),
                        hasIsbn(request.isbn()),
                        hasAuthorName(request.authorName())
                )));
            }

            boolean smartSearchActive = StringUtils.hasText(request.search());
            boolean authorFilterActive = StringUtils.hasText(request.authorName());
            boolean availableFilterActive = request.available() != null && request.available();

            if (query != null && (smartSearchActive || authorFilterActive || availableFilterActive)) {
                query.distinct(true);
            }

            return filterSpec.toPredicate(root, query, cb);
        };
    }

    // -----------------------------------------------------------------
    // BOOK SPECIFICATIONS
    // -----------------------------------------------------------------
    private static Specification<Book> hasIsbn(String isbn) {
        if (!StringUtils.hasText(isbn)) return null;
        return (root, query, cb) -> cb.like(root.get("isbn"), "%" + isbn + "%");
    }

    private static Specification<Book> hasTitle(String title) {
        if (!StringUtils.hasText(title)) return null;
        return (root, query, cb) -> cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }

    private static Specification<Book> hasAuthorName(String authorName) {
        if (!StringUtils.hasText(authorName)) return null;
        return (root, query, cb) -> {
            Join<Book, Author> author = getOrCreateJoin(root, "authors", JoinType.INNER);
            return cb.like(cb.lower(author.get("name")), "%" + authorName.toLowerCase() + "%");
        };
    }

    // -----------------------------------------------------------------
    // CATEGORY & PRICE SPECIFICATIONS
    // -----------------------------------------------------------------
    private static Specification<Book> hasCategoryIds(List<Long> categoryIds) {
        if (CollectionUtils.isEmpty(categoryIds)) return null;
        return (root, query, cb) -> {
            Join<Book, Category> category = getOrCreateJoin(root, "category", JoinType.INNER);
            return category.get("id").in(categoryIds);
        };
    }

    private static Specification<Book> hasMinPrice(BigDecimal minPrice) {
        if (minPrice == null) return null;
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    private static Specification<Book> hasMaxPrice(BigDecimal maxPrice) {
        if (maxPrice == null) return null;
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    // -----------------------------------------------------------------
    // COPY SPECIFICATIONS
    // -----------------------------------------------------------------
    private static Specification<Book> hasAvailableCopies(Boolean available) {
        if (available == null || !available) {
            return null;
        }
        return (root, query, cb) -> {
            Join<Book, Copy> copy = getOrCreateJoin(root, "copies", JoinType.INNER);
            return cb.equal(copy.get("status"), CopyStatus.AVAILABLE);
        };
    }
}