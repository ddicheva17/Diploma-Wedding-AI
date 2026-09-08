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
$analysis = trim($data["analysis"] ?? "");

if ($user_id <= 0 || $analysis === "") {
    echo json_encode([
        "success" => false,
        "message" => "Невалидни данни за AI анализа."
    ]);
    exit;
}

// Проверка за съществуващ wedding context
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

// Обновяване или създаване на AI анализа
if ($context_exists) {
    $stmt = $conn->prepare("
        UPDATE user_wedding_context
        SET latest_layout_analysis = ?
        WHERE user_id = ?
    ");

    $stmt->bind_param("si", $analysis, $user_id);
} else {
    $stmt = $conn->prepare("
        INSERT INTO user_wedding_context
            (user_id, latest_layout_analysis)
        VALUES (?, ?)
    ");

    $stmt->bind_param("is", $user_id, $analysis);
}

$stmt->execute();

echo json_encode([
    "success" => true,
    "message" => "AI анализът е запазен успешно."
]);

$stmt->close();
$conn->close();