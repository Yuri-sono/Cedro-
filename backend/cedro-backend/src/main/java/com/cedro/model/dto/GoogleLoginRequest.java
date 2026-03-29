package com.cedro.model.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleLoginRequest {
    
    @NotBlank
    private String token;
    
    public GoogleLoginRequest() {}
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}