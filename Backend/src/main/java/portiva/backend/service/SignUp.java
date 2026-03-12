package portiva.backend.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import portiva.backend.dtos.SignUpRequest;
import portiva.backend.models.User;
import portiva.backend.repositories.UserRepository;

@Service
public class SignUp {

  private final UserRepository userRepository;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public SignUp(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User register(SignUpRequest request) {
    validateRequest(request);

    if (userRepository.findByEmail(request.getEmail()) != null) {
      throw new IllegalArgumentException("Email is already in use");
    }

    if (userRepository.findByUsername(request.getUsername()) != null) {
      throw new IllegalArgumentException("Username is already in use");
    }

    User user = new User();
    user.setUsername(request.getUsername());
    user.setFirstName(request.getFirstName());
    user.setSecondName(request.getSecondName());
    user.setEmail(request.getEmail());
    user.setBio(request.getBio());
    user.setImageUrl(request.getImageUrl());
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

    return userRepository.save(user);
  }

  public User authenticate(String email, String rawPassword) {
    if (!StringUtils.hasText(email) || !StringUtils.hasText(rawPassword)) {
      throw new IllegalArgumentException("Email and password are required");
    }

    User user = userRepository.findByEmail(email);
    if (user == null || !passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
      throw new IllegalArgumentException("Invalid email or password");
    }

    return user;
  }

  private void validateRequest(SignUpRequest request) {
    if (request == null) {
      throw new IllegalArgumentException("Request must not be null");
    }

    if (!StringUtils.hasText(request.getUsername())) {
      throw new IllegalArgumentException("Username is required");
    }

    if (!StringUtils.hasText(request.getEmail())) {
      throw new IllegalArgumentException("Email is required");
    }

    if (!StringUtils.hasText(request.getPassword())) {
      throw new IllegalArgumentException("Password is required");
    }

    if (!StringUtils.hasText(request.getFirstName())) {
      throw new IllegalArgumentException("First name is required");
    }

    if (!StringUtils.hasText(request.getSecondName())) {
      throw new IllegalArgumentException("Second name is required");
    }
  }
}
