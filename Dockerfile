# Stage 1: Build the React app
FROM node:18 AS builder
WORKDIR /app
# Copy package files first for dependency caching
COPY package.json package-lock.json ./
RUN npm install
# Copy the rest of the app
COPY . .
# Build the app for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy built files from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html
# Copy custom Nginx config (optional, see below)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]