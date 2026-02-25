package portiva.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "username", nullable = false)
  private String username;

  @Column(name = "first_name", nullable = false)
  private String first_name;

  @Column(name = "second_name", nullable = false)
  private String second_name;

  @Column (name = "bio", nullable = true)
  private String bio;

  @Column(name = "email", nullable = false)
  private String email;

  @Column(name ="image_url", nullable = true)
  private String image_url;

  @OneToOne
  @JoinColumn(name = "portfolio_id")
  private Portfolio portfolio;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public String getFirst_name() {
    return first_name;
  }

  public String getSecond_name() {
    return second_name;
  }

  public String getBio() {
    return bio;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public void setBio(String bio) {
    this.bio = bio;
  }

  public void setSecond_name(String second_name) {
    this.second_name = second_name;
  }

  public void setFirst_name(String first_name) {
    this.first_name = first_name;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getImage_url() {
    return image_url;
  }

  public void setImage_url(String image_url) {
    this.image_url = image_url;
  }

  public Portfolio getPortfolio() {
    return portfolio;
  }

  public void setPortfolio(Portfolio portfolio) {
    this.portfolio = portfolio;
  }
}
