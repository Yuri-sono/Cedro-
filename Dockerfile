# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app/backend
COPY backend/cedro-backend/pom.xml ./
COPY backend/cedro-backend/src ./src
RUN mvn clean package -DskipTests

# Stage 3: Runtime — Nginx serves frontend + proxies /api to Spring Boot
FROM eclipse-temurin:17-jre
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy backend jar
COPY --from=backend-build /app/backend/target/cedro-backend-0.0.1-SNAPSHOT.jar /app/app.jar

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist /var/www/html

# Nginx config: serve frontend, proxy /api to localhost:8080
RUN printf 'server {\n\
    listen 80;\n\
    root /var/www/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    location /api/ {\n\
        proxy_pass http://localhost:8080/api/;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
    }\n\
}\n' > /etc/nginx/sites-available/default

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
