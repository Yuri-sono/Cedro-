package com.cedro.security;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;

import java.security.Principal;
import java.util.Map;

@Component
public class StompPrincipalHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        Object userIdObj = attributes.get("userId");
        final String name = userIdObj != null ? String.valueOf(userIdObj) : null;
        if (name == null) return null;
        return new Principal() {
            @Override
            public String getName() {
                return name;
            }
        };
    }
}
