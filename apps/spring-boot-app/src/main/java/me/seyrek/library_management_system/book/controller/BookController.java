package me.seyrek.library_management_system.book.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import me.seyrek.library_management_system.book.dto.BookDto;
import me.seyrek.library_management_system.book.dto.BookSearchRequest;
import me.seyrek.library_management_system.book.service.BookService;
import me.seyrek.library_management_system.common.ApiResponse;
import me.seyrek.library_management_system.common.PagedData;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    @Operation(summary = "Get all books with pagination and filtering")
    public ApiResponse<PagedData<BookDto>> getAllBooks(
            @ParameterObject BookSearchRequest request,
            @ParameterObject @PageableDefault(size = 20, sort = "id") Pageable pageable
    ) {
        Page<BookDto> books = bookService.getAllBooks(request, pageable);
        return ApiResponse.success(PagedData.of(books));
    }

    @GetMapping("/{id}")
    public ApiResponse<BookDto> getBookById(@PathVariable Long id) {
        return ApiResponse.success(bookService.getBookById(id));
    }
}