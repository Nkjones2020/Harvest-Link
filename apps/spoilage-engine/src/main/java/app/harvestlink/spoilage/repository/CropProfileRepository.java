package app.harvestlink.spoilage.repository;

import app.harvestlink.spoilage.model.CropProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CropProfileRepository extends JpaRepository<CropProfile, Long> {
    Optional<CropProfile> findByCropName(String cropName);
}
