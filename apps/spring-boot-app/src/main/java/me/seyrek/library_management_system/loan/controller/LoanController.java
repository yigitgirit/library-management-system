package me.seyrek.library_management_system.loan.controller;

import lombok.RequiredArgsConstructor;
import me.seyrek.library_management_system.common.ApiResponse;
import me.seyrek.library_management_system.common.PagedData;
import me.seyrek.library_management_system.loan.dto.LoanUserSearchRequest;
import me.seyrek.library_management_system.loan.dto.LoanUserSummaryDto;
import me.seyrek.library_management_system.loan.service.LoanService;
import me.seyrek.library_management_system.security.utils.SecurityUtils;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @GetMapping("/my-loans")
    public ApiResponse<PagedData<LoanUserSummaryDto>> getMyLoans(
            @ParameterObject LoanUserSearchRequest request,
            @ParameterObject @PageableDefault(size = 20, sort = "loanDate") Pageable pageable
    ) {
        Page<LoanUserSummaryDto> loans = loanService.getMyLoans(SecurityUtils.getCurrentUserId(), request, pageable);
        return ApiResponse.success(PagedData.of(loans));
    }
}
