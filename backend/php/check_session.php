<?php

// JSON и CORS настройки
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");

session_start();

// Проверка за активна потребителска сесия
if (isset($_SESSION["user_id"], $_SESSION["user_name"])) {
    echo json_encode([
        "logged_in" => true,
        "user_id" => $_SESSION["user_id"],
        "name" => $_SESSION["user_name"]
    ]);
} else {
    echo json_encode(["logged_in" => false]);
}