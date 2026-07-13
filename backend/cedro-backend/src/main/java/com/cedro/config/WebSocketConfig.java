package com.cedro.config;

import com.cedro.security.StompHandshakeInterceptor;
import com.cedro.security.StompPrincipalHandshakeHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompHandshakeInterceptor stompHandshakeInterceptor;
    private final StompPrincipalHandshakeHandler stompPrincipalHandshakeHandler;

    public WebSocketConfig(StompHandshakeInterceptor stompHandshakeInterceptor,
                           StompPrincipalHandshakeHandler stompPrincipalHandshakeHandler) {
        this.stompHandshakeInterceptor = stompHandshakeInterceptor;
        this.stompPrincipalHandshakeHandler = stompPrincipalHandshakeHandler;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-chat")
            .addInterceptors(stompHandshakeInterceptor)
            .setHandshakeHandler(stompPrincipalHandshakeHandler)
            .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }
}
