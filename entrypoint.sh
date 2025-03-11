#!/bin/sh

# Default BACKEND_URL if not set
BACKEND_URL=${BACKEND_URL:-http://backend:8080}

# Substitute BACKEND_URL into nginx.conf.template and output to nginx.conf
sed "s|{{BACKEND_URL}}|$BACKEND_URL|" /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Start Nginx
exec nginx -g "daemon off;"