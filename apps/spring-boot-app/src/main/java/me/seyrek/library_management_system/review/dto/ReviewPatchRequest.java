package me.seyrek.library_management_system.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReviewPatchRequest(
        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating must be at most 5")
        Integer rating,

        @NotBlank(message = "Comment is required")
        @Size(min = 10, max = 2000, message = "Comment must be between 10 and 2000 characters")
        String comment
) {}