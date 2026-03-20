package me.seyrek.library_management_system.review.dto;

import java.time.Instant;

public record ReviewSearchRequest(
        Long userId,
        String userEmail,
        Long bookId,
        String bookTitle,
        String isbn,
        Integer rating,
        Instant createdDateStart,
        Instant createdDateEnd
) {}