<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data["user_id"] ?? 0);
$notes = trim($data["notes"] ?? "");

if ($user_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Невалиден потребител."
    ]);
    exit;
}

// Проверка дали потребителят вече има сватбен контекст
$check = $conn->prepare("
    SELECT id
    FROM user_wedding_context
    WHERE user_id = ?
");

$check->bind_param("i", $user_id);
$check->execute();

$result = $check->get_result();
$context_exists = $result->num_rows > 0;

$check->close();

// Обновяване на съществуващ запис или създаване на нов
if ($context_exists) {
    $stmt = $conn->prepare("
        UPDATE user_wedding_context
        SET notes = ?
        WHERE user_id = ?
    ");

    $stmt->bind_param("si", $notes, $user_id);
} else {
    $stmt = $conn->prepare("
        INSERT INTO user_wedding_context (user_id, notes)
        VALUES (?, ?)
    ");

    $stmt->bind_param("is", $user_id, $notes);
}

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Сватбеният контекст е запазен успешно."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Грешка при запис."
    ]);
}

$stmt->close();
$conn->close();