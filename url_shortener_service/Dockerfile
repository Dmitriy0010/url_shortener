# Build stage
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Copy Gradle files
COPY gradle ./gradle
COPY gradlew ./
COPY build.gradle.kts ./
COPY settings.gradle.kts ./

# Copy source code
COPY src ./src

# Build the project - fix line endings and make executable
RUN sed -i 's/\r$//' gradlew && \
    chmod +x gradlew && \
    ./gradlew clean bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/build/libs/service.jar service.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "service.jar"]
