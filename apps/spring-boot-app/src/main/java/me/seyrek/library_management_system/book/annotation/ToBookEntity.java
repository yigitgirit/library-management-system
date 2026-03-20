package me.seyrek.library_management_system.book.annotation;

import org.mapstruct.Mapping;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.CLASS)
@Mapping(target = "id", ignore = true)
@Mapping(target = "authors", ignore = true)
@Mapping(target = "category", ignore = true)
@Mapping(target = "copies", ignore = true)
@Mapping(target = "averageRating", ignore = true)
@Mapping(target = "reviewCount", ignore = true)
@Mapping(target = "availableCopies", ignore = true)
public @interface ToBookEntity {
}
