<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"), true);

$full_name = trim($data["full_name"] ?? "");
$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

if ($full_name === "" || $email === "" || $password === "") {
    echo json_encode([
        "success" => false,
        "message" => "Моля, попълнете всички полета."
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "message" => "Моля, въведете валиден имейл адрес."
    ]);
    exit;
}

require_once "db.php";

// Проверка за съществуващ профил със същия имейл
$check_sql = "SELECT id FROM users WHERE email = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("s", $email);
$check_stmt->execute();

$check_result = $check_stmt->get_result();
$email_exists = $check_result->num_rows > 0;

$check_stmt->close();

if ($email_exists) {
    echo json_encode([
        "success" => false,
        "message" => "Вече съществува профил с този имейл."
    ]);

    $conn->close();
    exit;
}

// Защитено хеширане и записване на паролата
$password_hash = password_hash($password, PASSWORD_DEFAULT);

$insert_sql = "
    INSERT INTO users (full_name, email, password_hash)
    VALUES (?, ?, ?)
";

$insert_stmt = $conn->prepare($insert_sql);
$insert_stmt->bind_param("sss", $full_name, $email, $password_hash);

if ($insert_stmt->execute()) {
    $new_user_id = $conn->insert_id;

    echo json_encode([
        "success" => true,
        "message" => "Регистрацията е успешна.",
        "user" => [
            "id" => $new_user_id,
            "full_name" => $full_name,
            "email" => $email
        ]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Възникна грешка при създаване на профила."
    ]);
}

$insert_stmt->close();
$conn->close();