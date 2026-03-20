package me.seyrek.library_management_system.book.repository;

import me.seyrek.library_management_system.book.model.Book;
import me.seyrek.library_management_system.copy.model.CopyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
    @Override
    @NonNull
    Page<Book> findAll(@Nullable Specification<Book> spec, @NonNull Pageable pageable);

    @Override
    @NonNull
    Optional<Book> findById(@NonNull Long id);

    long countByCategoryId(Long categoryId);
    boolean existsByAuthorsId(Long authorId);
    Optional<Book> findByIsbn(String isbn);
}
