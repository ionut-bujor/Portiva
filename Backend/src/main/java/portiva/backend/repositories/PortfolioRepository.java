package portiva.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import portiva.backend.models.Portfolio;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
}
