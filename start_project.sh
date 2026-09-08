#!/bin/bash

# Стартираме винаги от основната директория на проекта.
cd "$(dirname "$0")" || exit 1

echo "==============================================="
echo "        Wedding AI Planner"
echo "==============================================="
echo
echo "Stopping old servers..."

pkill -f "php -S localhost:8000" 2>/dev/null
pkill -f "python3 app.py" 2>/dev/null

sleep 1

# Спира двата сървъра при натискане на CTRL + C.
cleanup() {
    echo
    echo "Stopping Wedding AI Planner..."

    kill "$PHP_PID" "$FLASK_PID" 2>/dev/null
    wait "$PHP_PID" "$FLASK_PID" 2>/dev/null

    echo "All servers stopped."
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "Starting PHP Server..."
php -S localhost:8000 &
PHP_PID=$!

echo "Starting Flask AI Backend..."
(
    cd ai-module || exit 1
    exec python3 app.py
) &
FLASK_PID=$!

echo
echo "==============================================="
echo "Project is running!"
echo "==============================================="
echo
echo "Frontend:"
echo "http://localhost:8000/frontend/index.html"
echo
echo "Dashboard:"
echo "http://localhost:8000/frontend/dashboard.html"
echo
echo "AI Backend:"
echo "http://127.0.0.1:5000"
echo
echo "Press CTRL + C to stop the project."
echo

wait