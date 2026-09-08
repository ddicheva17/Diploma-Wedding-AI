<?php

// Smart Offer Engine приема само POST заявки
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../../frontend/reservations.html");
    exit;
}

// Входни данни от формата
$clientName = trim($_POST["name"] ?? "");
$userId = (int)($_POST["user_id"] ?? 0);
$guestCount = (int)($_POST["guests"] ?? 0);
$budget = (float)($_POST["budget"] ?? 0);

// Проверка на броя гости и бюджета
if ($guestCount <= 0 || $budget <= 0) {
    echo "<script>
        alert('Моля, въведете брой гости и ориентировъчен бюджет.');
        window.history.back();
    </script>";
    exit;
}

// Всяка оферта трябва да принадлежи на логнат потребител
if ($userId <= 0) {
    echo "<script>
        alert('Не е открит логнат потребител. Моля, влезте отново в профила си.');
        window.location.href = '../../frontend/login.html';
    </script>";
    exit;
}

require_once "db.php";

// Проверка дали потребителят съществува
$userCheck = $conn->prepare("
    SELECT id
    FROM users
    WHERE id = ?
    LIMIT 1
");

if (!$userCheck) {
    die("Грешка при подготовка на заявката: " . $conn->error);
}

$userCheck->bind_param("i", $userId);
$userCheck->execute();

$userResult = $userCheck->get_result();
$userExists = $userResult->fetch_assoc();

$userCheck->close();

if (!$userExists) {
    $conn->close();

    echo "<script>
        alert('Потребителят не е намерен. Моля, влезте отново в профила си.');
        window.location.href = '../../frontend/login.html';
    </script>";
    exit;
}

// Избрани услуги и приложими цени според броя гости
$servicesQuery = $conn->prepare("
    SELECT
        s.id AS service_id,
        s.name AS service_name,
        spr.price AS service_price
    FROM user_selected_services uss
    INNER JOIN services s
        ON s.id = uss.service_id
    LEFT JOIN service_price_ranges spr
        ON spr.service_id = s.id
        AND ? >= spr.min_guests
        AND (
            spr.max_guests IS NULL
            OR ? <= spr.max_guests
        )
    WHERE uss.user_id = ?
    ORDER BY s.id
");

if (!$servicesQuery) {
    $errorMessage = $conn->error;
    $conn->close();

    die("Грешка при подготовка на услугите: " . $errorMessage);
}

$servicesQuery->bind_param(
    "iii",
    $guestCount,
    $guestCount,
    $userId
);

$servicesQuery->execute();
$servicesResult = $servicesQuery->get_result();

$selectedServices = [];
$estimatedPrice = 0;
$missingPriceRange = false;

while ($service = $servicesResult->fetch_assoc()) {
    // Не се генерира непълна оферта при липсващ ценови диапазон
    if ($service["service_price"] === null) {
        $missingPriceRange = true;
        break;
    }

    $servicePrice = (float)$service["service_price"];

    $selectedServices[] = [
        "id" => (int)$service["service_id"],
        "name" => $service["service_name"],
        "price" => $servicePrice
    ];

    $estimatedPrice += $servicePrice;
}

$servicesQuery->close();

// Офертата изисква поне една избрана услуга
if (count($selectedServices) === 0) {
    $conn->close();

    echo "<script>
        alert('За да генерирате персонализирана оферта, първо изберете поне една сватбена услуга.');
        window.location.href = '../../frontend/services.html';
    </script>";
    exit;
}

if ($missingPriceRange) {
    $conn->close();

    echo "<script>
        alert('За една от избраните услуги няма зададена цена за този брой гости.');
        window.history.back();
    </script>";
    exit;
}

// Определяне на препоръчителния пакет
if ($budget >= 15000 || $guestCount >= 150) {
    $recommendedPackage = "Premium";
    $recommendationText =
        "Premium пакетът е препоръчан за сватба с по-голям брой гости "
        . "или по-висок ориентировъчен бюджет. "
        . "Прогнозната стойност е изчислена според избраните от Вас услуги "
        . "и приложимите ценови диапазони.";
} elseif ($budget >= 8000 || $guestCount >= 80) {
    $recommendedPackage = "Standard";
    $recommendationText =
        "Standard пакетът е препоръчан според броя гости "
        . "и ориентировъчния бюджет. "
        . "Прогнозната стойност включва само избраните от Вас услуги.";
} else {
    $recommendedPackage = "Basic";
    $recommendationText =
        "Basic пакетът е подходящ за по-малко събитие "
        . "или за организация с по-ограничен бюджет. "
        . "Прогнозната стойност включва само избраните от Вас услуги.";
}

$budgetDifference = $budget - $estimatedPrice;

// Записване на генерираната оферта
$stmt = $conn->prepare("
    INSERT INTO offers (
        user_id,
        guest_count,
        budget,
        recommended_package,
        estimated_price,
        recommendation_text
    )
    VALUES (?, ?, ?, ?, ?, ?)
");

if (!$stmt) {
    $errorMessage = $conn->error;
    $conn->close();

    die("Грешка при подготовка на офертата: " . $errorMessage);
}

$stmt->bind_param(
    "iidsds",
    $userId,
    $guestCount,
    $budget,
    $recommendedPackage,
    $estimatedPrice,
    $recommendationText
);

if (!$stmt->execute()) {
    $errorMessage = $stmt->error;

    $stmt->close();
    $conn->close();

    error_log("Generate offer SQL error: " . $errorMessage);

    echo "<script>
        alert('Възникна грешка при записване на офертата.');
        window.history.back();
    </script>";
    exit;
}

$stmt->close();
$conn->close();

// Форматиране на паричните стойности
function formatMoney(float $value): string
{
    return number_format($value, 2, ",", " ") . " €";
}

// Безопасно визуализиране на динамичния текст
$safeRecommendation = htmlspecialchars(
    $recommendationText,
    ENT_QUOTES,
    "UTF-8"
);

$budgetStatusClass = $budgetDifference >= 0
    ? "budget-positive"
    : "budget-negative";

$budgetStatusTitle = $budgetDifference >= 0
    ? "Оставащ бюджет"
    : "Надвишаване на бюджета";

$budgetStatusText = $budgetDifference >= 0
    ? formatMoney($budgetDifference)
    : formatMoney(abs($budgetDifference));

?>
<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Интелигентна оферта | Wedding AI Planner</title>

    <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
    >
    <link
        rel="stylesheet"
        href="../../frontend/css/style.css"
    >
</head>

<body class="offer-result-page">
    <main class="offer-page">
        <div class="offer-container">
            <header class="offer-header">
                <span class="offer-label">Smart Offer Engine</span>

                <h1>Вашата персонализирана оферта</h1>

                <p>
                    Ориентировъчно предложение, генерирано
                    според избраните услуги, броя гости
                    и заявения бюджет.
                </p>
            </header>

            <section class="offer-main-card">
                <div class="offer-package">
                    <div>
                        <span>Препоръчан пакет</span>

                        <h2>
                            <?= htmlspecialchars(
                                $recommendedPackage,
                                ENT_QUOTES,
                                "UTF-8"
                            ) ?>
                        </h2>
                    </div>

                    <div class="offer-price">
                        <span>Ориентировъчна стойност</span>
                        <strong><?= formatMoney($estimatedPrice) ?></strong>
                    </div>
                </div>

                <div class="offer-content">
                    <div class="offer-grid">
                        <div class="offer-info-card">
                            <span>Брой гости</span>
                            <strong><?= $guestCount ?></strong>
                        </div>

                        <div class="offer-info-card">
                            <span>Заявен бюджет</span>
                            <strong><?= formatMoney($budget) ?></strong>
                        </div>
                    </div>

                    <div class="offer-breakdown">
                        <div class="offer-panel">
                            <h3>Разпределение на стойността</h3>

                            <?php foreach ($selectedServices as $service): ?>
                                <div class="price-row">
                                    <span>
                                        <?= htmlspecialchars(
                                            $service["name"],
                                            ENT_QUOTES,
                                            "UTF-8"
                                        ) ?>
                                    </span>

                                    <strong>
                                        <?= formatMoney($service["price"]) ?>
                                    </strong>
                                </div>
                            <?php endforeach; ?>

                            <div class="price-row price-total">
                                <span>Обща прогнозна стойност</span>
                                <strong><?= formatMoney($estimatedPrice) ?></strong>
                            </div>

                            <div class="price-row">
                                <span>Заявен бюджет</span>
                                <strong><?= formatMoney($budget) ?></strong>
                            </div>
                        </div>

                        <div class="offer-panel recommendation-panel">
                            <h3>Интелигентна препоръка</h3>
                            <p><?= $safeRecommendation ?></p>

                            <div class="budget-result <?= $budgetStatusClass ?>">
                                <span><?= $budgetStatusTitle ?></span>
                                <strong><?= $budgetStatusText ?></strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div class="offer-actions">
                <a
                    href="../../frontend/reservations.html"
                    class="offer-btn offer-btn-primary"
                    id="makeReservationBtn"
                >
                    Направи резервация
                </a>

                <a
                    href="../../frontend/reservations.html"
                    class="offer-btn offer-btn-secondary"
                >
                    Генерирай нова оферта
                </a>

                <a
                    href="../../frontend/dashboard.html"
                    class="offer-btn offer-btn-secondary"
                >
                    Към моя профил
                </a>

                <a
                    href="../../frontend/index.html"
                    class="offer-btn offer-btn-secondary"
                >
                    Начална страница
                </a>
            </div>
        </div>
    </main>

    <script>
        document
          .getElementById("makeReservationBtn")
          ?.addEventListener("click", () => {
            const offerFormData = {
              name: <?= json_encode(
                  $clientName,
                  JSON_UNESCAPED_UNICODE
              ) ?>,
              email: <?= json_encode(
                  $_POST["email"] ?? "",
                  JSON_UNESCAPED_UNICODE
              ) ?>,
              phone: <?= json_encode(
                  $_POST["phone"] ?? "",
                  JSON_UNESCAPED_UNICODE
              ) ?>,
              wedding_date: <?= json_encode(
                  $_POST["wedding_date"] ?? "",
                  JSON_UNESCAPED_UNICODE
              ) ?>,
              guests: <?= json_encode($guestCount) ?>,
              budget: <?= json_encode($budget) ?>
            };

            sessionStorage.setItem(
              "wedding_offer_form_data",
              JSON.stringify(offerFormData)
            );
          });
    </script>
</body>
</html>