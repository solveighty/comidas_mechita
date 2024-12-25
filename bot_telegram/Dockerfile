# Usar una imagen base de Node.js
FROM node:16

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar los archivos package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar las dependencias del bot
RUN npm install

# Copiar el resto del código fuente al contenedor
COPY . .

# Comando para ejecutar el bot
CMD ["node", "bot_telegram.js"]
