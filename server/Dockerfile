# Etapa 1: Construcción
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar herramientas de compilación para módulos nativos C/C++ (como better-sqlite3)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Eliminar dependencias de desarrollo conservando los módulos compilados
RUN npm prune --omit=dev

# Etapa 2: Ejecución
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]

