package portiva.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import portiva.backend.models.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
