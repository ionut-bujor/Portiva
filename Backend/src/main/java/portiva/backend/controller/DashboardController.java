package portiva.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import portiva.backend.dtos.DashboardDto;
import portiva.backend.security.JwtTokenProvider;
import portiva.backend.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

  private final DashboardService dashboardService;
  private final JwtTokenProvider tokenProvider;

  public DashboardController(DashboardService dashboardService, JwtTokenProvider tokenProvider) {
    this.dashboardService = dashboardService;
    this.tokenProvider = tokenProvider;
  }

  @GetMapping
  public ResponseEntity<?> getDashboard(@RequestHeader("Authorization") String authHeader) {
    try {
      Long userId = extractUserId(authHeader);
      DashboardDto dto = dashboardService.getDashboard(userId);
      return ResponseEntity.ok(dto);
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.badRequest().body(ex.getMessage());
    }
  }

  @PatchMapping
  public ResponseEntity<?> updateProfile(
      @RequestHeader("Authorization") String authHeader,
      @RequestBody DashboardDto dto) {
    try {
      Long userId = extractUserId(authHeader);
      DashboardDto updated = dashboardService.updateProfile(userId, dto);
      return ResponseEntity.ok(updated);
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.badRequest().body(ex.getMessage());
    }
  }

  private Long extractUserId(String authHeader) {
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      throw new IllegalArgumentException("Missing or invalid Authorization header");
    }
    String token = authHeader.substring(7);
    String subject = tokenProvider.getSubject(token);
    return Long.parseLong(subject);
  }
}