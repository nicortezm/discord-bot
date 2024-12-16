# Etapa de construcción
FROM node:22.11.0-alpine as builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar dependencias de desarrollo
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:22.11.0-alpine as deploy

# Establecer directorio de trabajo
WORKDIR /app

# Copiar artefactos de construcción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Exponer puerto (ajustar según tu aplicación)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]