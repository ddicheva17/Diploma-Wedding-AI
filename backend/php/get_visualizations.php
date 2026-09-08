<?php

// JSON и CORS настройки
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require_once "db.php";

// Прочитане и проверка на потребителя
$data = json_decode(file_get_contents("php://input"), true);
$user_id = intval($data["user_id"] ?? 0);

if ($user_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Невалиден потребител.",
        "visualizations" => []
    ]);
    exit;
}

// Зареждане на визуализациите от най-новата към най-старата
$sql = "
    SELECT id, prompt, image_base64, created_at
    FROM wedding_visualizations
    WHERE user_id = ?
    ORDER BY created_at DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$visualizations = [];

while ($row = $result->fetch_assoc()) {
    $visualizations[] = [
        "id" => $row["id"],
        "prompt" => $row["prompt"],
        "image_base64" => $row["image_base64"],
        "created_at" => $row["created_at"]
    ];
}

echo json_encode([
    "success" => true,
    "visualizations" => $visualizations
]);

$stmt->close();
$conn->close();