package me.seyrek.library_management_system.book.dto;

public record BookShortDto(
        Long id,
        String isbn,
        String title,
        Integer availableCopies,
        Double averageRating,
        Integer reviewCount
) {
}