package app.harvestlink.spoilage.model;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpoilageResult {
    private Integer spoilageDays;
    private String spoilageRisk;
    private Double spoilageScore;
    private Double temperatureC;
    private Double humidityPct;
}
