<?php

// JSON и CORS настройки
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require_once "db.php";

// Прочитане и проверка на входните данни
$data = json_decode(file_get_contents("php://input"), true);
$user_id = intval($data["user_id"] ?? 0);

if ($user_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Невалиден потребител."
    ]);
    exit;
}

// Създаване на нова чат сесия
$title = "AI Wedding Consultation";
$sql = "INSERT INTO chat_sessions (user_id, title) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $user_id, $title);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "session_id" => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Неуспешно създаване на чат сесия."
    ]);
}

$stmt->close();
$conn->close();