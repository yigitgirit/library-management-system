package me.seyrek.library_management_system.review.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import me.seyrek.library_management_system.book.model.Book;
import me.seyrek.library_management_system.common.model.BaseEntity;
import me.seyrek.library_management_system.user.model.User;

@Getter
@Setter
@Entity
@Table(name = "reviews", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"book_id", "user_id"})
})
public class Review extends BaseEntity {

    @NotNull(message = "Book cannot be null")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @NotNull(message = "User cannot be null")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "Rating cannot be null")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    @Column(nullable = false)
    private Integer rating;

    @NotBlank(message = "Comment cannot be blank")
    @Size(max = 2000, message = "Comment can be at most 2000 characters")
    @Column(length = 2000, nullable = false)
    private String comment;

    @Version
    @Column(name = "version", nullable = false)
    @Setter(AccessLevel.PROTECTED)
    private Long version = 0L;
}