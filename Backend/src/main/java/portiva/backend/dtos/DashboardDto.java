package portiva.backend.dtos;

public class DashboardDto {

  // Read-only fields (returned on GET, ignored on PATCH)
  private String username;
  private String firstName;
  private String secondName;
  private String email;
  private String imageUrl;

  // Editable profile fields
  private String bio;
  private String headline;
  private String website;

  public DashboardDto() {}

  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }

  public String getFirstName() { return firstName; }
  public void setFirstName(String firstName) { this.firstName = firstName; }

  public String getSecondName() { return secondName; }
  public void setSecondName(String secondName) { this.secondName = secondName; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getImageUrl() { return imageUrl; }
  public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

  public String getBio() { return bio; }
  public void setBio(String bio) { this.bio = bio; }

  public String getHeadline() { return headline; }
  public void setHeadline(String headline) { this.headline = headline; }

  public String getWebsite() { return website; }
  public void setWebsite(String website) { this.website = website; }
}