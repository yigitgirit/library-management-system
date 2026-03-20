package me.seyrek.library_management_system.loan.mapper;

import me.seyrek.library_management_system.fine.mapper.FineMapper;
import me.seyrek.library_management_system.loan.dto.*;
import me.seyrek.library_management_system.loan.model.Loan;
import org.mapstruct.*;

import java.time.Instant;

@Mapper(componentModel = "spring", uses = {FineMapper.class})
public interface LoanMapper {

    // --- Main Mappers ---

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.email", target = "userEmail")
    @Mapping(source = "copy.id", target = "copyId")
    @Mapping(source = "copy.book.title", target = "bookTitle")
    @Mapping(source = "copy.book.isbn", target = "bookIsbn")
    @Mapping(source = "copy.book.coverImageUrl", target = "bookCoverUrl")
    @Mapping(source = "loan", target = "isOverdue", qualifiedByName = "isLoanOverdue")
    LoanDto toLoanDto(Loan loan);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.email", target = "userEmail")
    @Mapping(source = "user.firstName", target = "userFirstName") // Added
    @Mapping(source = "user.lastName", target = "userLastName")   // Added
    @Mapping(source = "copy.id", target = "copyId")
    @Mapping(source = "copy.barcode", target = "copyBarcode")     // Added
    @Mapping(source = "copy.book.title", target = "bookTitle")
    @Mapping(source = "copy.book.isbn", target = "bookIsbn")
    @Mapping(source = "copy.book.coverImageUrl", target = "bookCoverUrl")
    @Mapping(source = "loan", target = "isOverdue", qualifiedByName = "isLoanOverdue")
    LoanDetailDto toLoanDetailDto(Loan loan);

    @Mapping(source = "copy.book.title", target = "bookTitle")
    @Mapping(source = "copy.book.coverImageUrl", target = "bookCoverUrl")
    @Mapping(source = "loan", target = "isOverdue", qualifiedByName = "isLoanOverdue")
    LoanUserSummaryDto toLoanUserSummaryDto(Loan loan);


    // --- Helper Methods ---

    @Named("isLoanOverdue")
    default boolean isLoanOverdue(Loan loan) {
        if (loan.getReturnDate() != null) {
            return loan.getReturnDate().isAfter(loan.getDueDate());
        }
        return Instant.now().isAfter(loan.getDueDate());
    }

    // --- Request Mappers ---

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "copy", ignore = true)
    @Mapping(target = "loanDate", ignore = true)
    @Mapping(target = "returnDate", ignore = true)
    @Mapping(target = "fines", ignore = true)
    @Mapping(target = "status", ignore = true)
    Loan fromLoanCreateRequest(LoanCreateRequest request);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "copy", ignore = true)
    @Mapping(target = "loanDate", ignore = true)
    @Mapping(target = "fines", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateLoanFromRequest(LoanUpdateRequest request, @MappingTarget Loan loan);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "copy", ignore = true)
    @Mapping(target = "loanDate", ignore = true)
    @Mapping(target = "fines", ignore = true)
    @Mapping(target = "status", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchLoanFromRequest(LoanPatchRequest request, @MappingTarget Loan loan);

    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "userEmail", ignore = true)
    @Mapping(target = "copyId", ignore = true)
    @Mapping(target = "barcode", ignore = true)
    @Mapping(target = "bookId", ignore = true)
    @Mapping(target = "loanDateStart", ignore = true)
    @Mapping(target = "loanDateEnd", ignore = true)
    @Mapping(target = "dueDateStart", ignore = true)
    @Mapping(target = "dueDateEnd", ignore = true)
    @Mapping(target = "returnDateStart", ignore = true)
    @Mapping(target = "returnDateEnd", ignore = true)
    LoanSearchRequest toLoanSearchRequest(LoanUserSearchRequest userRequest, Long userId);
}