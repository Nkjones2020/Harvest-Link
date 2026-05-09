package app.harvestlink.spoilage.controller;

import app.harvestlink.spoilage.model.*;
import app.harvestlink.spoilage.service.SpoilageCalculatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/spoilage")
@RequiredArgsConstructor
public class SpoilageController {
    private final SpoilageCalculatorService calculatorService;

    @PostMapping("/calculate")
    public ResponseEntity<SpoilageResult> calculate(@RequestBody SpoilageRequest req) {
        return ResponseEntity.ok(calculatorService.calculate(req));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("spoilage-engine OK");
    }
}
