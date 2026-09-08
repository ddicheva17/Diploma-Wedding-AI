<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$user_id = intval($data["user_id"] ?? 0);

if ($user_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Невалиден потребител."
    ]);
    exit;
}

// Зареждане на сватбения контекст на потребителя
$stmt = $conn->prepare("
    SELECT *
    FROM user_wedding_context
    WHERE user_id = ?
    LIMIT 1
");

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$context = $result->num_rows > 0
    ? $result->fetch_assoc()
    : null;

echo json_encode([
    "success" => true,
    "context" => $context
]);

$stmt->close();
$conn->close();