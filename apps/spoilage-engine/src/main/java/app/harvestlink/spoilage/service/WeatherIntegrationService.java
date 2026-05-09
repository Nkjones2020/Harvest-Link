package app.harvestlink.spoilage.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import lombok.extern.slf4j.Slf4j;
import java.util.Map;

@Service
@Slf4j
public class WeatherIntegrationService {
    @Value("${OPENWEATHER_API_KEY:no_key_provided}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public double getCurrentTemperature(double lat, double lon) {
        if ("no_key_provided".equals(apiKey) || apiKey.isEmpty()) {
            log.warn("Weather API key not set, using baseline 28.0C");
            return 28.0;
        }

        try {
            String url = String.format(
                "https://api.openweathermap.org/data/2.5/weather?lat=%f&lon=%f&appid=%s&units=metric",
                lat, lon, apiKey
            );
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("main")) {
                Map<String, Object> main = (Map<String, Object>) response.get("main");
                return Double.parseDouble(main.get("temp").toString());
            }
        } catch (Exception e) {
            log.error("Failed to fetch weather data: {}", e.getMessage());
        }

        return 28.0; // Fallback
    }
}
