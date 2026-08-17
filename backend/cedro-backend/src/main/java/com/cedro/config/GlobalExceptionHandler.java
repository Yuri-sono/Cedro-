package com.cedro.config;

import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // Padrão uniforme: retornar a mensagem de validação no campo "error",
        // igual aos demais tratadores (RuntimeException, ResponseStatusException, etc.).
        String message = ex.getBindingResult().getAllErrors().stream()
                .findFirst()
                .map(org.springframework.validation.FieldError.class::cast)
                .map(org.springframework.validation.FieldError::getDefaultMessage)
                .orElse("Erro de validação");
        return ResponseEntity.badRequest().body(Map.of("error", message));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "error", "Nao foi possivel salvar os dados. Verifique o tamanho da imagem e tente novamente."
        ));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException ex) {
        String message = ex.getReason();
        if (message == null || message.isBlank()) {
            message = "Erro ao processar sua solicitacao";
        }
        return ResponseEntity.status(ex.getStatusCode()).body(Map.of("error", message));
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
                message.contains("Google") ||
                message.contains("CRP") ||
                message.contains("Especialidade") ||
                message.contains("Tipo de psicologo") ||
                message.contains("Valor da consulta") ||
                message.contains("Area de interesse") ||
                message.contains("psicologo") ||
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
