package portiva.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import portiva.backend.dtos.SignUpRequest;
import portiva.backend.models.User;
import portiva.backend.service.SignUp;

@RestController
@RequestMapping("/api/auth")
public class SignUpController {

  private final SignUp signUpService;

  public SignUpController(SignUp signUpService) {
    this.signUpService = signUpService;
  }

  @PostMapping("/signup")
  public ResponseEntity<?> signUp(@RequestBody SignUpRequest request) {
    try {
      User created = signUpService.register(request);
      // For now, return the created user without the password hash information being used on the client.
      created.setPasswordHash(null);
      return ResponseEntity.status(HttpStatus.CREATED).body(created);
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.badRequest().body(ex.getMessage());
    }
  }
}
