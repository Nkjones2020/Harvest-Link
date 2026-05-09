package app.harvestlink.spoilage.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "crop_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CropProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "crop_name", unique = true, nullable = false)
    private String cropName;

    @Column(name = "daily_loss_rate_pct", nullable = false)
    private Double dailyLossRatePct;

    @Column(name = "cold_store_factor")
    private Double coldStoreFactor;

    @Column(name = "grain_bag_factor")
    private Double grainBagFactor;

    @Column(name = "silo_factor")
    private Double siloFactor;

    @Column(name = "optimal_temp_c")
    private Double optimalTempC;

    @Column(name = "optimal_humidity")
    private Double optimalHumidity;
}
