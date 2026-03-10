package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditScoreRequest {
    @NotBlank(message = "ИНН обязателен для заполнения")
    private String inn;

    @NotBlank(message = "Дата рождения обязательна")
    private String birthDate;
}
