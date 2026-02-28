# ---- Build ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Passa a URL da API em build time via ARG
ARG VITE_API_URL=http://localhost:3333
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# ---- Production com Nginx ----
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
