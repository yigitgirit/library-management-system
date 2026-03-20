package me.seyrek.library_management_system.book.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import me.seyrek.library_management_system.author.model.Author;
import me.seyrek.library_management_system.category.model.Category;
import me.seyrek.library_management_system.common.model.BaseEntity;
import me.seyrek.library_management_system.copy.model.Copy;
import org.hibernate.annotations.NaturalId;
import org.hibernate.validator.constraints.ISBN;
import org.hibernate.validator.constraints.URL;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "books")
public class Book extends BaseEntity {
    @NaturalId(mutable = true)
    @Column(nullable = false, unique = true)
    @NotBlank(message = "ISBN cannot be blank")
    @ISBN(message = "ISBN should be valid")
    private String isbn;

    @NotBlank(message = "Title cannot be blank")
    @Column(nullable = false)
    private String title;

    @Size(max = 5000, message = "Description can be at most 5000 characters")
    private String description;

    @URL(message = "Cover image URL should be valid")
    private String coverImageUrl;

    @NotNull(message = "Price cannot be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    private String publisher;

    private LocalDate publishedDate;

    @Column(name = "page_count")
    private Integer pageCount;

    private String language;

    private String format;

    @Column(name = "average_rating", nullable = false)
    private double averageRating = 0.0;

    @Column(name = "review_count", nullable = false)
    private int reviewCount = 0;

    @NotEmpty(message = "Authors cannot be empty")
    @ManyToMany
    @JoinTable(
            name = "book_authors",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    private Set<Author> authors;

    @NotNull(message = "Category cannot be null")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "book", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<Copy> copies;

    @Column(name = "available_copies", nullable = false)
    private int availableCopies = 0;

    @Version
    @Column(name = "version", nullable = false)
    @Setter(AccessLevel.PROTECTED)
    private Long version;

    @PrePersist
    @PreUpdate
    private void normalizeIsbn() {
        if (this.isbn != null) {
            this.isbn = this.isbn.replaceAll("[^0-9X]", "");
        }
    }
}