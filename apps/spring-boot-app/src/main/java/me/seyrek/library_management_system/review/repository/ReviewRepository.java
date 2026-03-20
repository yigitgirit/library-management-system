package me.seyrek.library_management_system.review.repository;

import me.seyrek.library_management_system.review.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>, JpaSpecificationExecutor<Review> {
    Page<Review> findByBookId(Long bookId, Pageable pageable);
    Page<Review> findByUserId(Long userId, Pageable pageable);
    Optional<Review> findByBookIdAndUserId(Long bookId, Long userId);
    boolean existsByBookIdAndUserId(Long bookId, Long userId);
}