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
        "message" => "Невалиден потребител."
    ]);
    exit;
}

// Търсене на последната чат сесия на потребителя
$select_sql = "
    SELECT id
    FROM chat_sessions
    WHERE user_id = ?
    ORDER BY updated_at DESC
    LIMIT 1
";

$select_stmt = $conn->prepare($select_sql);
$select_stmt->bind_param("i", $user_id);
$select_stmt->execute();

$result = $select_stmt->get_result();

if ($result->num_rows > 0) {
    $session = $result->fetch_assoc();

    echo json_encode([
        "success" => true,
        "session_id" => $session["id"],
        "is_new" => false
    ]);

    $select_stmt->close();
    $conn->close();
    exit;
}

$select_stmt->close();

// Създаване на нова сесия, когато няма съществуваща
$title = "AI Wedding Consultation";
$insert_sql = "INSERT INTO chat_sessions (user_id, title) VALUES (?, ?)";

$insert_stmt = $conn->prepare($insert_sql);
$insert_stmt->bind_param("is", $user_id, $title);

if ($insert_stmt->execute()) {
    echo json_encode([
        "success" => true,
        "session_id" => $insert_stmt->insert_id,
        "is_new" => true
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Неуспешно създаване на чат сесия."
    ]);
}

$insert_stmt->close();
$conn->close();