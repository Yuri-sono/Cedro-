package com.cedro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class CedroBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CedroBackendApplication.class, args);
		System.out.println("[Cedro] Rodando na :3001");
	}

	@GetMapping("/")
	public String home() {
		return "ok";
	}
}
