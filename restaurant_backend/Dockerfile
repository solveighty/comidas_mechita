# Paso 1: Usar una imagen base de Maven para compilar el proyecto
FROM maven:3.8.7-eclipse-temurin-17 AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo pom.xml y descargar las dependencias
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar el resto de los archivos del proyecto
COPY src ./src

# Construir el proyecto y generar el archivo JAR
RUN mvn clean package -DskipTests

# Paso 2: Usar una imagen base de OpenJDK para ejecutar la aplicación
FROM eclipse-temurin:17-jdk-alpine

# Copiar el archivo JAR desde la etapa de construcción
COPY --from=builder /app/target/*.jar /app.jar

# Exponer el puerto 8080
EXPOSE 8080

# Ejecutar la aplicación Spring Boot
ENTRYPOINT ["java", "-jar", "/app.jar"]
