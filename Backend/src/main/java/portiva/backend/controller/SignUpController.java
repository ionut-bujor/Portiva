package portiva.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import portiva.backend.dtos.AuthResponse;
import portiva.backend.dtos.LoginRequest;
import portiva.backend.dtos.SignUpRequest;
import portiva.backend.models.User;
import portiva.backend.security.JwtTokenProvider;
import portiva.backend.service.SignUp;

@RestController
@RequestMapping("/api/auth")
public class SignUpController {

  private final SignUp signUpService;
  private final JwtTokenProvider tokenProvider;

  public SignUpController(SignUp signUpService, JwtTokenProvider tokenProvider) {
    this.signUpService = signUpService;
    this.tokenProvider = tokenProvider;
  }

  @PostMapping("/signup")
  public ResponseEntity<?> signUp(@RequestBody SignUpRequest request) {
    try {
      User created = signUpService.register(request);
      String token = tokenProvider.generateToken(created.getUserId().toString());
      AuthResponse response =
          new AuthResponse(token, created.getUserId(), created.getUsername(), created.getEmail());
      return ResponseEntity.status(HttpStatus.CREATED).body(response);
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.badRequest().body(ex.getMessage());
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    try {
      User user = signUpService.authenticate(request.getEmail(), request.getPassword());
      String token = tokenProvider.generateToken(user.getUserId().toString());
      AuthResponse response =
          new AuthResponse(token, user.getUserId(), user.getUsername(), user.getEmail());
      return ResponseEntity.ok(response);
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }
  }
}
