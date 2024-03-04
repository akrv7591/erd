# Use a base image with Node.js installed
FROM node:alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json or yarn.lock to the working directory
COPY package.json package-lock.json* yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the entire project to the working directory
COPY . .

# Build the React project
RUN yarn build

# Stage 2: Use a lighter image to serve the built files
FROM node:alpine

# Install serve globally
RUN yarn global add serve

# Set working directory
WORKDIR /app

# Copy built files from the previous stage
COPY --from=builder /app/dist ./dist

# Expose port 3000 (the default port used by serve)
EXPOSE 3001


# Command to serve the built files
CMD ["serve", "-s", "dist", "-p", "3001"]
