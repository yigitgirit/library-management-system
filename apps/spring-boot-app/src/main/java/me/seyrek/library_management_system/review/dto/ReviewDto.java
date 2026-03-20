package me.seyrek.library_management_system.review.dto;

import java.time.Instant;

public record ReviewDto(
        Long id,
        Long bookId,
        Long userId,
        String userName,
        Integer rating,
        String comment,
        Instant createdAt,
        Instant updatedAt
) {}