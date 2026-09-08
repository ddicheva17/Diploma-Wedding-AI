<?php

// JSON и CORS настройки
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require_once "db.php";

// Прочитане и проверка на chat session ID
$data = json_decode(file_get_contents("php://input"), true);
$session_id = intval($data["session_id"] ?? 0);

if ($session_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Невалидна чат сесия.",
        "messages" => []
    ]);
    exit;
}

// Зареждане на съобщенията в хронологичен ред
$sql = "
    SELECT sender, message, created_at
    FROM chat_messages
    WHERE session_id = ?
    ORDER BY created_at ASC, id ASC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $session_id);
$stmt->execute();

$result = $stmt->get_result();
$messages = [];

while ($row = $result->fetch_assoc()) {
    $messages[] = [
        "sender" => $row["sender"],
        "message" => $row["message"],
        "created_at" => $row["created_at"]
    ];
}

echo json_encode([
    "success" => true,
    "messages" => $messages
]);

$stmt->close();
$conn->close();