FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q

# Stage 2: Minimal runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/spoilage-engine-*.jar app.jar
EXPOSE 8080

# JVM tuning for containers
ENTRYPOINT ["java", \
 "-XX:MaxRAMPercentage=75.0", \
 "-XX:+UseContainerSupport", \
 "-jar", "app.jar"]
