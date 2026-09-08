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
$layout_json = $data["layout_json"] ?? "";

if ($user_id <= 0 || $layout_json === "") {
    echo json_encode([
        "success" => false,
        "message" => "Невалидни данни за запазване на залата."
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

// Обновяване или създаване на Hall Planner разпределението
if ($context_exists) {
    $stmt = $conn->prepare("
        UPDATE user_wedding_context
        SET latest_layout_json = ?
        WHERE user_id = ?
    ");

    $stmt->bind_param("si", $layout_json, $user_id);
} else {
    $stmt = $conn->prepare("
        INSERT INTO user_wedding_context
            (user_id, latest_layout_json)
        VALUES (?, ?)
    ");

    $stmt->bind_param("is", $user_id, $layout_json);
}

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Разпределението е запазено успешно в профила."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Грешка при запазване на разпределението."
    ]);
}

$stmt->close();
$conn->close();