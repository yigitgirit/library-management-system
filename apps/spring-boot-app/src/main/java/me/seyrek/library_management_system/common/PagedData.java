package me.seyrek.library_management_system.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * A standardized DTO for paginated responses, wrapping Spring Data's Page object.
 * This ensures clean JSON structure and compatibility with Swagger generics.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "PagedData", description = "Wrapper for paged responses containing data and metadata")
public class PagedData<T> {

    @Schema(description = "List of items in the current page")
    private List<T> content;

    @Schema(description = "Pagination information")
    private PageMetadata page;

    /**
     * Maps a standard Spring Data Page to this PagedResponse.
     */
    public PagedData(Page<T> springPage) {
        this.content = springPage.getContent();
        this.page = new PageMetadata(
                springPage.getSize(),
                springPage.getTotalElements(),
                springPage.getTotalPages(),
                springPage.getNumber()
        );
    }

    /**
     * Static factory method for cleaner syntax in Controllers.
     */
    public static <T> PagedData<T> of(Page<T> springPage) {
        return new PagedData<>(springPage);
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "PageMetadata", description = "Metadata about the current pagination state")
    public static class PageMetadata {

        @Schema(description = "Number of items per page", example = "20")
        private int size;

        @Schema(description = "Total number of elements across all pages", example = "100")
        private long totalElements;

        @Schema(description = "Total number of pages", example = "5")
        private int totalPages;

        @Schema(description = "Current page number (zero-based index)", example = "0")
        private int number;
    }
}