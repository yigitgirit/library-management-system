package me.seyrek.library_management_system.fine.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.seyrek.library_management_system.common.ApiResponse;
import me.seyrek.library_management_system.common.PagedData;
import me.seyrek.library_management_system.fine.dto.FineDto;
import me.seyrek.library_management_system.fine.dto.FineUserSearchRequest;
import me.seyrek.library_management_system.fine.service.FineService;
import me.seyrek.library_management_system.payment.dto.PaymentRequest;
import me.seyrek.library_management_system.security.utils.SecurityUtils;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fines")
@RequiredArgsConstructor
public class FineController {

    private final FineService fineService;

    // TODO: fineStatus, bookTitle parametreleri yeterli olacaktır
    @GetMapping("/my-fines")
    public ApiResponse<PagedData<FineDto>> getMyFines(
            @ParameterObject FineUserSearchRequest request,
            @ParameterObject @PageableDefault(size = 20, sort = "fineDate", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<FineDto> fines = fineService.getMyFines(SecurityUtils.getCurrentUserId(), request, pageable);
        return ApiResponse.success(PagedData.of(fines));
    }

    @PostMapping("/{id}/pay")
    public ApiResponse<FineDto> payFine(@PathVariable Long id, @Valid @RequestBody PaymentRequest request) {
        return ApiResponse.success(fineService.payFine(id, request));
    }
}