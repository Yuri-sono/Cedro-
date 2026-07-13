package com.cedro.security;

import com.cedro.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;

import java.net.URI;
import java.util.Map;

@Component
public class StompHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;

    @Autowired
    public StompHandshakeInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        URI uri = request.getURI();
        if (uri == null) return false;

        String token = UriComponentsBuilder.fromUri(uri).build().getQueryParams().getFirst("token");
        if (token == null || jwtUtil.isTokenExpired(token)) {
            return false;
        }

        Integer userId = jwtUtil.extractUserId(token);
        if (userId == null) return false;

        attributes.put("userId", String.valueOf(userId));
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // no-op
    }
}
