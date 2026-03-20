package me.seyrek.library_management_system.review.mapper;

import me.seyrek.library_management_system.review.dto.ReviewCreateRequest;
import me.seyrek.library_management_system.review.dto.ReviewDto;
import me.seyrek.library_management_system.review.dto.ReviewPatchRequest;
import me.seyrek.library_management_system.review.dto.ReviewUpdateRequest;
import me.seyrek.library_management_system.review.model.Review;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", expression = "java(review.getUser() != null ? review.getUser().getName() : null)")
    ReviewDto toReviewDto(Review review);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    Review fromReviewCreateRequest(ReviewCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateReviewFromRequest(ReviewUpdateRequest request, @MappingTarget Review review);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchReviewFromRequest(ReviewPatchRequest request, @MappingTarget Review review);
}