package portiva.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import portiva.backend.dtos.PublicPortfolioDto;
import portiva.backend.service.PublicPortfolioService;

@RestController
@RequestMapping("/api/portfolio")
public class PublicPortfolioController {

  private final PublicPortfolioService publicPortfolioService;

  public PublicPortfolioController(PublicPortfolioService publicPortfolioService) {
    this.publicPortfolioService = publicPortfolioService;
  }

  @GetMapping("/{username}")
  public ResponseEntity<?> getPortfolio(@PathVariable String username) {
    try {
      PublicPortfolioDto dto = publicPortfolioService.getByUsername(username);
      return ResponseEntity.ok(dto);
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.notFound().build();
    }
  }
}