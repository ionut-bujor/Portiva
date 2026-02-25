package portiva.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Project {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long projectId;

  @Column(nullable = false)
  private String projectName;

  @Column(nullable = false)
  private String description;

  @Column(nullable = false)
  private String technologiesUsed;

  @ManyToOne
  @JoinColumn(name = "portfolio_id", nullable = false)
  private Portfolio portfolio;

  public Long getProjectId() {
    return projectId;
  }

  public void setProjectId(Long projectId) {
    this.projectId = projectId;
  }

  public String getProjectName() {
    return projectName;
  }

  public String getDescription() {
    return description;
  }

  public String getTechnologiesUsed() {
    return technologiesUsed;
  }

  public Portfolio getPortfolio() {
    return portfolio;
  }

  public void setPortfolio(Portfolio portfolio) {
    this.portfolio = portfolio;
  }

  public void setTechnologiesUsed(String technologiesUsed) {
    this.technologiesUsed = technologiesUsed;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public void setProjectName(String projectName) {
    this.projectName = projectName;
  }
}
