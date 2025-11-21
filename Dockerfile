

FROM node:20-alpine AS deps
WORKDIR /app

# Install production dependencies for the backend only
COPY back_end/package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy backend source code
COPY back_end/. .

# Reuse previously installed dependencies
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 5000
CMD ["node", "server.js"]

