<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

if ($email === "" || $password === "") {
    echo json_encode([
        "success" => false,
        "message" => "Моля, попълнете имейл и парола."
    ]);
    exit;
}

require_once "db.php";

// Търсене на потребителя по имейл
$sql = "
    SELECT id, full_name, email, password_hash
    FROM users
    WHERE email = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    $response = [
        "success" => false,
        "message" => "Не е намерен профил с този имейл."
    ];
} elseif (!password_verify($password, $user["password_hash"])) {
    $response = [
        "success" => false,
        "message" => "Грешна парола."
    ];
} else {
    $response = [
        "success" => true,
        "message" => "Успешен вход.",
        "user" => [
            "id" => $user["id"],
            "full_name" => $user["full_name"],
            "email" => $user["email"]
        ]
    ];
}

echo json_encode($response);

$stmt->close();
$conn->close();