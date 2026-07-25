# Etapa 1: Construcción
FROM node:20-alpine AS builder
WORKDIR /app

# Recibir la variable VITE_API_URL en tiempo de compilación
ARG VITE_API_URL=https://okarea.es/api/v1
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: Servidor de producción
FROM nginx:alpine
# Copiar los archivos compilados a la ruta por defecto de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
