package com.cedro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication(exclude = { UserDetailsServiceAutoConfiguration.class })
@RestController
public class CedroBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CedroBackendApplication.class, args);
	}

	@GetMapping("/")
	public String home() {
		return "ok";
	}
}
