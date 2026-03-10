package com.example.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreditScoreResponse {
    private String inn;
    private String birthDate;
    private String clientName;       // ФИО из нашей базы
    private int totalScore;
    private String decision;
    private String colorClass;
    
    // Результаты по базам
    private String nalogStatus;      // Статус самозанятого/ИП (Налог.ру)
    private String fsspStatus;       // Долги у приставов (ФССП)
    private String kadStatus;        // Судебные дела (КАД Арбитр)
    private String konturStatus;     // Данные из Контур.Фокус
    
    private String timestamp;
}
