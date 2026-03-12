package portiva.backend.service;

import org.springframework.stereotype.Service;
import portiva.backend.dtos.DashboardDto;
import portiva.backend.models.User;
import portiva.backend.repositories.UserRepository;

@Service
public class DashboardService {

  private final UserRepository userRepository;

  public DashboardService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public DashboardDto getDashboard(Long userId) {
    User user = findUserOrThrow(userId);
    return mapToDto(user);
  }

  public DashboardDto updateProfile(Long userId, DashboardDto dto) {
    User user = findUserOrThrow(userId);

    if (dto.getBio() != null) {
      user.setBio(dto.getBio());
    }
    if (dto.getHeadline() != null) {
      user.setHeadline(dto.getHeadline());
    }
    if (dto.getWebsite() != null) {
      user.setWebsite(dto.getWebsite());
    }

    userRepository.save(user);
    return mapToDto(user);
  }

  private User findUserOrThrow(Long userId) {
    return userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));
  }

  private DashboardDto mapToDto(User user) {
    DashboardDto dto = new DashboardDto();
    dto.setUsername(user.getUsername());
    dto.setFirstName(user.getFirstName());
    dto.setSecondName(user.getSecondName());
    dto.setEmail(user.getEmail());
    dto.setImageUrl(user.getImageUrl());
    dto.setBio(user.getBio());
    dto.setHeadline(user.getHeadline());
    dto.setWebsite(user.getWebsite());
    return dto;
  }
}