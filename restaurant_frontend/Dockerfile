# Etapa 1: Construir la aplicación
FROM node:18 AS builder

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos del proyecto
COPY package.json package-lock.json ./
COPY . .

# Instalar las dependencias y construir la aplicación
RUN npm install && npm run build

# Etapa 2: Servir la aplicación
FROM node:18 AS runner

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar un servidor de Node.js ligero
RUN npm install -g serve

# Copiar los archivos generados por el build desde la etapa de construcción
COPY --from=builder /app/dist ./dist

# Puerto expuesto
EXPOSE 3000

# Comando de inicio del contenedor
CMD ["serve", "-s", "dist", "-l", "3000"]
