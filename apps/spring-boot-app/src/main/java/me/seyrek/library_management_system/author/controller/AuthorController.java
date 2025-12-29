package me.seyrek.library_management_system.author.controller;

import me.seyrek.library_management_system.author.dto.AuthorDto;
import me.seyrek.library_management_system.author.service.AuthorService;
import me.seyrek.library_management_system.common.ApiResponse;
import me.seyrek.library_management_system.common.PagedData;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/authors")
public class AuthorController {

    private final AuthorService authorService;

    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @GetMapping
    public ApiResponse<PagedData<AuthorDto>> getAllAuthors(
            @RequestParam(required = false) String name,
            @ParameterObject @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        Page<AuthorDto> authors = authorService.getAllAuthors(name, pageable);
        return ApiResponse.success(PagedData.of(authors));
    }

    @GetMapping("/{id}")
    public ApiResponse<AuthorDto> getAuthorById(@PathVariable Long id) {
        return ApiResponse.success(authorService.getAuthorById(id));
    }
}