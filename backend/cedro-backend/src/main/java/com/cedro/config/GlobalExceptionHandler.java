package com.cedro.config;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        // SEGURANÇA: Não vazar detalhes internos do sistema
        String message = ex.getMessage();
        // Mensagens conhecidas/intencionais podem ser retornadas
        if (message != null && (
                message.contains("Email") || 
                message.contains("Senha") || 
                message.contains("senha") ||
                message.contains("encontrado") || 
                message.contains("incorreto") ||
                message.contains("em uso") ||
                message.contains("indisponivel") ||
                message.contains("Precisa ter") ||
                message.contains("caractere especial") ||
                message.contains("Agora") ||
                message.contains("Google") ||
                message.contains("psicólogo") ||
                message.contains("Acesso"))) {
            return ResponseEntity.badRequest().body(Map.of("error", message));
        }
        // Mensagens desconhecidas: retornar erro genérico
        return ResponseEntity.badRequest().body(Map.of("error", "Erro ao processar sua solicitação"));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        return ResponseEntity.status(500).body(Map.of("error", "Algo deu errado"));
    }
}
