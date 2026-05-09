package app.harvestlink.spoilage.service;

import app.harvestlink.spoilage.model.*;
import app.harvestlink.spoilage.repository.CropProfileRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class SpoilageCalculatorService {
    private final CropProfileRepository cropRepo;
    private final WeatherIntegrationService weatherService;

    public SpoilageResult calculate(SpoilageRequest req) {
        CropProfile crop = cropRepo.findByCropName(req.getCropType().toLowerCase())
            .orElseThrow(() -> new IllegalArgumentException("Unknown crop: " + req.getCropType()));

        // Get real-time weather data based on location
        double currentTemp = weatherService.getCurrentTemperature(req.getLatitude(), req.getLongitude()); 
        
        // Temperature adjustment: rate doubles every 10°C above optimal (Q10 rule)
        double tempFactor = Math.pow(2.0, (currentTemp - crop.getOptimalTempC()) / 10.0);
        
        // Storage method factor
        double storageFactor = switch (req.getStorageMethod()) {
            case "cold_store" -> 1.0 / crop.getColdStoreFactor();
            case "grain_bag" -> 1.0 / crop.getGrainBagFactor();
            case "silo" -> 1.0 / crop.getSiloFactor();
            default -> 1.0; // open_air = baseline
        };

        // Days since harvest
        long daysElapsed = ChronoUnit.DAYS.between(req.getHarvestDate(), LocalDate.now());
        
        // Adjusted daily loss rate
        double adjustedRate = crop.getDailyLossRatePct() * tempFactor * storageFactor / 100.0;
        
        // Current loss percentage: 1 - e^(-k * t)
        double currentLoss = (1 - Math.exp(-adjustedRate * daysElapsed)) * 100;
        
        // Days until 30% loss threshold
        // 0.30 = 1 - e^(-k * t) -> t = -ln(0.70) / k
        double daysUntil30PctLoss = -Math.log(0.70) / adjustedRate;
        int daysRemaining = Math.max(0, (int) Math.round(daysUntil30PctLoss - daysElapsed));

        // Risk classification
        String risk = daysRemaining >= 5 ? "green" : daysRemaining >= 2 ? "amber" : "red";

        return SpoilageResult.builder()
            .spoilageDays(daysRemaining)
            .spoilageRisk(risk)
            .spoilageScore(Math.round(currentLoss * 100.0) / 100.0)
            .temperatureC(currentTemp)
            .build();
    }
}
