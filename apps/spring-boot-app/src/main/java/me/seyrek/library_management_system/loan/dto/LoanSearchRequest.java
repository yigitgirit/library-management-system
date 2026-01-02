package me.seyrek.library_management_system.loan.dto;

import me.seyrek.library_management_system.loan.model.LoanStatus;

import java.time.Instant;

public record LoanSearchRequest(
        // about the user
        Long userId,
        String userEmail,  // TODO: remove, but natural id?

        // book / copy
        Long copyId, // data ID
        String barcode, // natural ID
        Long bookId, // data ID
        String isbn, // natural ID  // TODO: remove
        String bookTitle, // TODO: remove

        // loan status
        LoanStatus status,
        Boolean overdue, // TODO: already have status

        // date range
        Instant loanDateStart,
        Instant loanDateEnd,
        Instant dueDateStart,
        Instant dueDateEnd,
        Instant returnDateStart,
        Instant returnDateEnd
) {
}
