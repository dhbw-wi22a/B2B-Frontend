# Dockerfile for Angular app build

# Stage 1: Build the Angular app
FROM node:18 as build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Build the Angular app
RUN npm run build --prod


