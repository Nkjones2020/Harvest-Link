package app.harvestlink.spoilage.model;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpoilageRequest {
    private String cropType;
    private LocalDate harvestDate;
    private String storageMethod;
    private Double latitude;
    private Double longitude;
}
