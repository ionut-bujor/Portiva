package portiva.backend.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import portiva.backend.dtos.PublicPortfolioDto;
import portiva.backend.dtos.PublicPortfolioDto.ProjectDto;
import portiva.backend.models.Portfolio;
import portiva.backend.models.Project;
import portiva.backend.models.User;
import portiva.backend.repositories.UserRepository;

@Service
public class PublicPortfolioService {

  private final UserRepository userRepository;

  public PublicPortfolioService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public PublicPortfolioDto getByUsername(String username) {
    User user = userRepository.findByUsername(username);
    if (user == null) {
      throw new IllegalArgumentException("Portfolio not found");
    }

    PublicPortfolioDto dto = new PublicPortfolioDto();
    dto.setUsername(user.getUsername());
    dto.setFirstName(user.getFirstName());
    dto.setSecondName(user.getSecondName());
    dto.setHeadline(user.getHeadline());
    dto.setBio(user.getBio());
    dto.setWebsite(user.getWebsite());
    dto.setImageUrl(user.getImageUrl());

    Portfolio portfolio = user.getPortfolio();
    if (portfolio != null && portfolio.getProjects() != null) {
      List<ProjectDto> projectDtos = portfolio.getProjects().stream()
          .map(this::mapProject)
          .collect(Collectors.toList());
      dto.setProjects(projectDtos);
    } else {
      dto.setProjects(List.of());
    }

    return dto;
  }

  private ProjectDto mapProject(Project project) {
    ProjectDto dto = new ProjectDto();
    dto.setProjectId(project.getProjectId());
    dto.setProjectName(project.getProjectName());
    dto.setDescription(project.getDescription());
    dto.setTechnologiesUsed(project.getTechnologiesUsed());
    return dto;
  }
}