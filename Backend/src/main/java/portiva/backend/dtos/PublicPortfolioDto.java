package portiva.backend.dtos;

import java.util.List;

public class PublicPortfolioDto {

  private String username;
  private String firstName;
  private String secondName;
  private String headline;
  private String bio;
  private String website;
  private String imageUrl;
  private List<ProjectDto> projects;

  public static class ProjectDto {
    private Long projectId;
    private String projectName;
    private String description;
    private String technologiesUsed;

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTechnologiesUsed() { return technologiesUsed; }
    public void setTechnologiesUsed(String technologiesUsed) { this.technologiesUsed = technologiesUsed; }
  }

  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }

  public String getFirstName() { return firstName; }
  public void setFirstName(String firstName) { this.firstName = firstName; }

  public String getSecondName() { return secondName; }
  public void setSecondName(String secondName) { this.secondName = secondName; }

  public String getHeadline() { return headline; }
  public void setHeadline(String headline) { this.headline = headline; }

  public String getBio() { return bio; }
  public void setBio(String bio) { this.bio = bio; }

  public String getWebsite() { return website; }
  public void setWebsite(String website) { this.website = website; }

  public String getImageUrl() { return imageUrl; }
  public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

  public List<ProjectDto> getProjects() { return projects; }
  public void setProjects(List<ProjectDto> projects) { this.projects = projects; }
}