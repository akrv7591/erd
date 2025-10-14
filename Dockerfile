# Use a base image with Node.js installed
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy the entire project to the working directory
COPY . .

# Install dependencies
RUN yarn install

# Build the React project
RUN yarn build

# Stage 2: Use a lighter image to serve the built files
FROM node:21-alpine as server

# Install serve globally
RUN yarn global add serve

# Set working directory
WORKDIR /app

# Copy built files from the previous stage
COPY --from=builder /app/dist ./dist

# Command to serve the built files
CMD ["serve", "-s", "dist", "-p", "3000"]
