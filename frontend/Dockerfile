# ==============================
# Stage 1: Build
# ==============================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy all files
COPY . .

# Build Next.js (Tailwind จะ compile ลง .next/static/css)
RUN npm run build

# ==============================
# Stage 2: Production
# ==============================
FROM node:20-alpine AS production

WORKDIR /app

# Copy package.json & install production deps only
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy built Next.js app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app ./app
COPY --from=builder /app/components ./components
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
