# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Spring Boot backend
FROM eclipse-temurin:17-jdk-alpine AS backend-builder
WORKDIR /app
# Copy maven files first for better caching
COPY demo/mvnw .
COPY demo/.mvn .mvn
COPY demo/pom.xml .
RUN chmod +x mvnw
# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy backend source
COPY demo/src ./src
# Copy built frontend to static resources
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static/

# Build the application
RUN ./mvnw clean package -DskipTests

# Stage 3: Run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/target/demo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
