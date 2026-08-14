# ─── Stage 1: Build ─────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

# Install dependencies first (layer-cached unless package files change)
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy source and build
COPY . .

# VITE_API_BASE_URL is intentionally left as '/' so the browser uses relative
# paths and nginx handles proxying /api -> api-gateway:8080 within the stack.
ARG VITE_API_BASE_URL=/
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# ─── Stage 2: Serve ──────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config (SPA routing + API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
