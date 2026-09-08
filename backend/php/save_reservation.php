<?php

// Обработват се само заявки, изпратени от формата
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    exit;
}

// Прочитане и нормализиране на данните
$clientName = trim($_POST["name"] ?? "");
$userId = !empty($_POST["user_id"]) ? (int)$_POST["user_id"] : null;
$clientEmail = trim($_POST["email"] ?? "");
$clientPhone = trim($_POST["phone"] ?? "");
$weddingDate = trim($_POST["wedding_date"] ?? "");
$guestCount = (int)($_POST["guests"] ?? 0);
$weddingSeason = trim($_POST["season"] ?? "");
$weddingStyle = trim($_POST["style"] ?? "");
$budget = !empty($_POST["budget"]) ? (float)$_POST["budget"] : null;
$message = trim($_POST["message"] ?? "");

// Backend валидация на задължителните полета
if (
    $clientName === "" ||
    $clientEmail === "" ||
    $clientPhone === "" ||
    $weddingDate === "" ||
    $guestCount <= 0 ||
    $weddingSeason === "" ||
    $weddingStyle === ""
) {
    echo "<script>
        alert('Моля, попълнете всички задължителни полета.');
        window.history.back();
    </script>";
    exit;
}

if (!filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
    echo "<script>
        alert('Моля, въведете валиден имейл адрес.');
        window.history.back();
    </script>";
    exit;
}

if (!preg_match('/^\+?[0-9\s\-]{8,20}$/', $clientPhone)) {
    echo "<script>
        alert('Моля, въведете валиден телефонен номер.');
        window.history.back();
    </script>";
    exit;
}

if ($budget !== null && $budget < 1000) {
    echo "<script>
        alert('Минималният бюджет трябва да бъде поне 1000 €.');
        window.history.back();
    </script>";
    exit;
}

require_once "db.php";

// Проверка дали избраната дата вече е заета
$check = $conn->prepare(
    "SELECT id FROM reservations WHERE wedding_date = ?"
);
$check->bind_param("s", $weddingDate);
$check->execute();

$result = $check->get_result();
$dateIsTaken = $result->num_rows > 0;

$check->close();

if ($dateIsTaken) {
    echo "<script>
        alert('Съжаляваме, тази дата вече е заета.');
        window.history.back();
    </script>";

    $conn->close();
    exit;
}

// Записване на новата резервация
$stmt = $conn->prepare("
    INSERT INTO reservations (
        user_id,
        client_name,
        client_email,
        client_phone,
        wedding_date,
        guest_count,
        wedding_season,
        wedding_style,
        budget,
        additional_message
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "issssissds",
    $userId,
    $clientName,
    $clientEmail,
    $clientPhone,
    $weddingDate,
    $guestCount,
    $weddingSeason,
    $weddingStyle,
    $budget,
    $message
);

if ($stmt->execute()) {
    echo "<script>
        alert('Вашата заявка за резервация беше изпратена успешно.');
        window.location.href = '../../frontend/reservations.html';
    </script>";
} else {
    echo "<script>
        alert('Възникна грешка при запис на резервацията.');
        window.history.back();
    </script>";
}

$stmt->close();
$conn->close();