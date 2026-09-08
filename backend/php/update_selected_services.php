<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data["user_id"] ?? 0);
$service_name = trim($data["service_name"] ?? "");

if ($user_id <= 0 || $service_name === "") {
    echo json_encode([
        "success" => false,
        "message" => "Невалидни данни."
    ]);
    exit;
}

// Намиране на услугата в основния каталог
$serviceStmt = $conn->prepare("
    SELECT id
    FROM services
    WHERE name = ?
    LIMIT 1
");

$serviceStmt->bind_param("s", $service_name);
$serviceStmt->execute();

$serviceResult = $serviceStmt->get_result();
$service = $serviceResult->fetch_assoc();

$serviceStmt->close();

if (!$service) {
    echo json_encode([
        "success" => false,
        "message" => "Услугата не е намерена."
    ]);

    $conn->close();
    exit;
}

$service_id = intval($service["id"]);

// Гарантиране на запис за Wedding Context
$contextStmt = $conn->prepare("
    INSERT INTO user_wedding_context (user_id)
    SELECT ?
    WHERE NOT EXISTS (
        SELECT 1
        FROM user_wedding_context
        WHERE user_id = ?
    )
");

$contextStmt->bind_param("ii", $user_id, $user_id);
$contextStmt->execute();
$contextStmt->close();

// Запис в междинната таблица без допускане на дублиране
$insertStmt = $conn->prepare("
    INSERT IGNORE INTO user_selected_services (user_id, service_id)
    VALUES (?, ?)
");

$insertStmt->bind_param("ii", $user_id, $service_id);

if (!$insertStmt->execute()) {
    echo json_encode([
        "success" => false,
        "message" => "Грешка при запис на услугата."
    ]);

    $insertStmt->close();
    $conn->close();
    exit;
}

$insertStmt->close();

// Връщане на всички избрани услуги по име
$listStmt = $conn->prepare("
    SELECT s.name
    FROM user_selected_services uss
    INNER JOIN services s
        ON s.id = uss.service_id
    WHERE uss.user_id = ?
    ORDER BY s.name ASC
");

$listStmt->bind_param("i", $user_id);
$listStmt->execute();

$listResult = $listStmt->get_result();
$services = [];

while ($row = $listResult->fetch_assoc()) {
    $services[] = $row["name"];
}

$listStmt->close();

echo json_encode([
    "success" => true,
    "message" => "Услугата е добавена към вашата сватба.",
    "selected_services" => $services
], JSON_UNESCAPED_UNICODE);

$conn->close();