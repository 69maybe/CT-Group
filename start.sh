#!/bin/bash

# Start PostgreSQL
service postgresql start
su - postgres -c "psql -c \"CREATE DATABASE greenlife;\" 2>/dev/null || true"
su - postgres -c "psql -c \"ALTER USER postgres PASSWORD 'postgres123';\""

# Start Backend
su - postgres -c "cd /app/backend && java -Dserver.port=5000 -jar target/*.jar &"

# Wait for backend to start
sleep 30

# Start Frontend with custom server
cd /app/frontend
node server.js &

# Keep container running
tail -f /dev/null
