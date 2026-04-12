# Build stage
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src  
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy jar
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 5000

# 👇 QUAN TRỌNG: không dùng sh -c
ENTRYPOINT ["java","-Xmx512m","-Xms256m","-jar","app.jar","--server.port=5000","--server.address=0.0.0.0"]