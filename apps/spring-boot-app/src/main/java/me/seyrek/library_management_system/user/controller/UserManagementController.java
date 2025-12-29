package me.seyrek.library_management_system.user.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import me.seyrek.library_management_system.common.ApiResponse;
import me.seyrek.library_management_system.common.PagedData;
import me.seyrek.library_management_system.user.dto.*;
import me.seyrek.library_management_system.user.service.UserService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/management/users")
@AllArgsConstructor
public class UserManagementController {

    private final UserService userService;

    // TODO: add UserSearchRequest for filtering
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PagedData<UserDto>> getAllUsers(
            @ParameterObject @PageableDefault(size = 20, sort = "id")
            Pageable pageable
    ) {
        Page<UserDto> users = userService.findAllUsers(pageable);
        return ApiResponse.success(PagedData.of(users));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserDto> createUser(@Valid @RequestBody UserCreateRequest request) {
        return ApiResponse.success(userService.createUser(request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserDto> getUserById(@PathVariable Long id) {
        return ApiResponse.success(userService.findUserById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserUpdateResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
        return ApiResponse.success(userService.updateUser(id, userUpdateRequest));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ApiResponse.success();
    }

    @PostMapping("/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> banUser(@PathVariable Long id, @Valid @RequestBody UserBanRequest request) {
        userService.banUser(id, request.reason());
        return ApiResponse.success();
    }

    @PostMapping("/{id}/unban")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> unbanUser(@PathVariable Long id) {
        userService.unbanUser(id, "User unbanned by admin.");
        return ApiResponse.success();
    }
}