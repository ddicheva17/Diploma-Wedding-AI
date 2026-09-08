#!/bin/bash

echo "Stopping Wedding AI Planner..."

# Спира локалните PHP и Flask сървъри.
pkill -f "php -S localhost:8000" 2>/dev/null
pkill -f "python3 app.py" 2>/dev/null

echo "All servers stopped."