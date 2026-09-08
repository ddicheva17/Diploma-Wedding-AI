<?php

// JSON и CORS настройки
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require_once "db.php";

// Прочитане и нормализиране на входните данни
$data = json_decode(file_get_contents("php://input"), true);

$session_id = intval($data["session_id"] ?? 0);
$sender = trim($data["sender"] ?? "");
$message = trim($data["message"] ?? "");

if ($session_id <= 0 || $sender === "" || $message === "") {
    echo json_encode([
        "success" => false,
        "message" => "Липсват данни за запис на съобщението."
    ]);
    exit;
}

// Допускат се само потребителски и AI съобщения
if ($sender !== "user" && $sender !== "bot") {
    echo json_encode([
        "success" => false,
        "message" => "Невалиден тип изпращач."
    ]);
    exit;
}

// Записване на съобщението в историята на чата
$sql = "
    INSERT INTO chat_messages (session_id, sender, message)
    VALUES (?, ?, ?)
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iss", $session_id, $sender, $message);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Съобщението е записано успешно."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Възникна грешка при запис на съобщението."
    ]);
}

$stmt->close();
$conn->close();