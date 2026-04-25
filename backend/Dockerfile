# Stage 1: Build
FROM node:20-slim AS build

# Instala dependências necessárias para compilação (se houver)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia apenas arquivos de dependências para aproveitar o cache de camada
COPY package*.json ./
RUN npm ci

# Copia o resto e compila
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-slim

# Definir ambiente de produção
ENV NODE_ENV=production

WORKDIR /app

# Copia apenas as dependências de produção
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copia o build e arquivos estáticos do stage anterior
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

# Cria a pasta de uploads e define permissões para o usuário node
RUN mkdir -p public/uploads && chown -R node:node /app

# Segurança: Rodar como usuário não-root
USER node

EXPOSE 3000

# Usar exec form para garantir que sinais do SO sejam repassados corretamente
CMD ["node", "dist/src/index.js"]
