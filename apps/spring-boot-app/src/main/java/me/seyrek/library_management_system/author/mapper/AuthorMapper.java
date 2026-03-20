package me.seyrek.library_management_system.author.mapper;

import me.seyrek.library_management_system.author.dto.AuthorCreateRequest;
import me.seyrek.library_management_system.author.dto.AuthorDto;
import me.seyrek.library_management_system.author.model.Author;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuthorMapper {
    AuthorDto toAuthorDto(Author author);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "bookCount", ignore = true)
    Author fromAuthorCreateRequest(AuthorCreateRequest request);
}