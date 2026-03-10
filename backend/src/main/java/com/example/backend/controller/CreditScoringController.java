package com.example.backend.controller;

import com.example.backend.dto.CreditScoreRequest;
import com.example.backend.dto.CreditScoreResponse;
import com.example.backend.service.CreditScoringService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scoring")
@RequiredArgsConstructor
public class CreditScoringController {

    private final CreditScoringService scoringService;

    @PostMapping("/calculate")
    public ResponseEntity<CreditScoreResponse> calculateCreditScore(@RequestBody @Valid CreditScoreRequest request) {
        CreditScoreResponse response = scoringService.calculateScore(request);
        return ResponseEntity.ok(response);
    }
}
