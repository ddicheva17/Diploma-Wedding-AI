<?php

// JSON и CORS настройки
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require_once "db.php";

// Прочитане и нормализиране на входните данни
$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data["user_id"] ?? 0);
$prompt = trim($data["prompt"] ?? "");
$image_base64 = trim($data["image_base64"] ?? "");

if ($user_id <= 0 || $prompt === "" || $image_base64 === "") {
    echo json_encode([
        "success" => false,
        "message" => "Липсват данни за запазване на визуализацията."
    ]);
    exit;
}

// Записване на AI визуализацията
$sql = "
    INSERT INTO wedding_visualizations (user_id, prompt, image_base64)
    VALUES (?, ?, ?)
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iss", $user_id, $prompt, $image_base64);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Визуализацията е запазена успешно."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Възникна грешка при запазване на визуализацията."
    ]);
}

$stmt->close();
$conn->close();