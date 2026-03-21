package me.seyrek.library_management_system.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.seyrek.library_management_system.config.SecurityConfig;
import me.seyrek.library_management_system.security.service.JpaUserDetailsService;
import me.seyrek.library_management_system.security.service.JwtService;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final JpaUserDetailsService userDetailsService;
    private final HandlerExceptionResolver handlerExceptionResolver;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String userId = jwtService.extractSubject(jwt);

            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                log.debug("JWT token found for user ID: {}. Initializing security context.", userId);
                if (!jwtService.isTokenExpired(jwt)) {
                    UserDetails userDetails = this.userDetailsService.loadByUserId(userId);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    log.warn("JWT token has expired for user ID: {}", userId);
                }
            } else if (userId != null) {
                log.trace("Security context already contains authentication for user ID: {}. Skipping token validation.", userId);
            }
            filterChain.doFilter(request, response);
        } catch (Exception exception) {
            log.error("Error occurred while processing JWT token: {}", exception.getMessage());
            handlerExceptionResolver.resolveException(request, response, null, exception);
        }
    }

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        AntPathMatcher pathMatcher = new AntPathMatcher();
        String path = request.getServletPath();
        
        boolean shouldNotFilter = Arrays.stream(SecurityConfig.PUBLIC_ENDPOINTS)
                .anyMatch(pattern -> pathMatcher.match(pattern, path));

        if (shouldNotFilter) {
            log.trace("Skipping JWT filter for public path: {}", path);
        }

        return shouldNotFilter;
    }
}
