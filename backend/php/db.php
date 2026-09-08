<?php

// Настройки за връзка с MySQL базата данни
$host = "localhost";
$user = "root";
$password = "";
$database = "wedding_ai_planner";

// Създаване и проверка на връзката
$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// Поддръжка на български текст и специални символи
$conn->set_charset("utf8mb4");