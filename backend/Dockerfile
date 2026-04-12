# Build stage
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

COPY . .
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

# Railway / Docker: mặc định prod — tránh fallback application.yml → profile dev → 127.0.0.1:5433
ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java","-Xmx256m","-jar","app.jar"]