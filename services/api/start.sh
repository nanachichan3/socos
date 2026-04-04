#!/bin/sh
cd /app
echo "[startup] Starting NestJS at $(date)"
node dist/main.js
echo "[startup] NestJS exited with code $?"
