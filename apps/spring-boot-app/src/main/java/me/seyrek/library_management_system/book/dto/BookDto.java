package me.seyrek.library_management_system.book.dto;

import me.seyrek.library_management_system.author.dto.AuthorDto;
import me.seyrek.library_management_system.category.dto.CategoryDto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

public record BookDto(
        Long id,
        String isbn,
        String title,
        String description,
        String coverImageUrl,
        BigDecimal price,
        String publisher,
        LocalDate publishedDate,
        Integer pageCount,
        String language,
        String format,
        Integer availableCopies,
        String availableLocation,
        Double averageRating,
        Integer reviewCount,
        Set<AuthorDto> authors,
        CategoryDto category
) {
}