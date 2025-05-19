# Use Node.js LTS version with Alpine for smaller attack surface
FROM node:20.11-alpine

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with security fixes
RUN npm ci --only=production && \
    npm audit fix --force && \
    # Clean npm cache
    npm cache clean --force

# Copy application code
COPY . .

# Set proper permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 80

# Start the application
CMD ["node", "main.js"]
