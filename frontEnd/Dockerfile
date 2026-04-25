# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Cache de dependências
COPY package*.json ./
RUN npm ci

# Copia e build
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine

# Copia os arquivos do build
COPY --from=build /app/dist /usr/share/nginx/html

# Copia a configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
