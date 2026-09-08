-- =========================================================
-- WEDDING AI PLANNER
-- Основна схема на базата данни
-- =========================================================

CREATE DATABASE IF NOT EXISTS wedding_ai_planner
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE wedding_ai_planner;


-- =========================================================
-- 1. ПОТРЕБИТЕЛИ
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 2. КАТАЛОГ С УСЛУГИ
-- =========================================================

CREATE TABLE IF NOT EXISTS services (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_services_name (name)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- Начални услуги. INSERT IGNORE предотвратява дублиране.
INSERT IGNORE INTO services (
    name,
    category,
    description,
    base_price
) VALUES
(
    'Цялостно сватбено планиране',
    'Планиране',
    'Пълна организация и координация на сватбеното събитие.',
    5000.00
),
(
    'Декорация и стайлинг',
    'Декорация',
    'Изграждане на визуална концепция и декорация на събитието.',
    2500.00
),
(
    'Сватбени покани',
    'Покани',
    'Персонализирани покани според стила на събитието.',
    750.00
),
(
    'Сватбени торти',
    'Торти',
    'Изработка на сватбена торта по индивидуален дизайн.',
    1200.00
),
(
    'Заря и пироефекти',
    'Пироефекти',
    'Организация на светлинни и пиротехнически ефекти.',
    1800.00
);


-- =========================================================
-- 3. ЦЕНОВИ ДИАПАЗОНИ НА УСЛУГИТЕ
-- Цената се определя според броя гости.
-- NULL в max_guests означава неограничен горен диапазон.
-- =========================================================

CREATE TABLE IF NOT EXISTS service_price_ranges (
    id INT NOT NULL AUTO_INCREMENT,
    service_id INT NOT NULL,
    min_guests INT NOT NULL,
    max_guests INT DEFAULT NULL,
    price DECIMAL(10,2) NOT NULL,

    PRIMARY KEY (id),

    UNIQUE KEY uq_service_guest_range (
        service_id,
        min_guests,
        max_guests
    ),

    CONSTRAINT fk_service_price_ranges_service
        FOREIGN KEY (service_id)
        REFERENCES services(id)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- Добавя липсващите ценови диапазони без дублиране.
INSERT INTO service_price_ranges (
    service_id,
    min_guests,
    max_guests,
    price
)
SELECT
    s.id,
    price_data.min_guests,
    price_data.max_guests,
    price_data.price
FROM (
    SELECT
        'Цялостно сватбено планиране' AS service_name,
        1 AS min_guests,
        150 AS max_guests,
        5000.00 AS price

    UNION ALL
    SELECT 'Цялостно сватбено планиране', 151, 250, 7000.00

    UNION ALL
    SELECT 'Цялостно сватбено планиране', 251, NULL, 9000.00

    UNION ALL
    SELECT 'Декорация и стайлинг', 1, 150, 2500.00

    UNION ALL
    SELECT 'Декорация и стайлинг', 151, 250, 4500.00

    UNION ALL
    SELECT 'Декорация и стайлинг', 251, NULL, 6500.00

    UNION ALL
    SELECT 'Сватбени покани', 1, 150, 750.00

    UNION ALL
    SELECT 'Сватбени покани', 151, 250, 1100.00

    UNION ALL
    SELECT 'Сватбени покани', 251, NULL, 1500.00

    UNION ALL
    SELECT 'Сватбени торти', 1, 150, 1200.00

    UNION ALL
    SELECT 'Сватбени торти', 151, 250, 1800.00

    UNION ALL
    SELECT 'Сватбени торти', 251, NULL, 2500.00

    UNION ALL
    SELECT 'Заря и пироефекти', 1, 150, 1800.00

    UNION ALL
    SELECT 'Заря и пироефекти', 151, 250, 2200.00

    UNION ALL
    SELECT 'Заря и пироефекти', 251, NULL, 2600.00
) AS price_data
INNER JOIN services s
    ON s.name = price_data.service_name
LEFT JOIN service_price_ranges existing_range
    ON existing_range.service_id = s.id
    AND existing_range.min_guests = price_data.min_guests
    AND existing_range.max_guests <=> price_data.max_guests
WHERE existing_range.id IS NULL;


-- =========================================================
-- 4. РЕЗЕРВАЦИИ
-- Официален източник за дата, гости, сезон, стил и бюджет.
-- =========================================================

CREATE TABLE IF NOT EXISTS reservations (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,

    client_name VARCHAR(150) NOT NULL,
    client_email VARCHAR(150) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,

    wedding_date DATE NOT NULL,
    guest_count INT NOT NULL,
    wedding_season VARCHAR(50) NOT NULL,
    wedding_style VARCHAR(100) NOT NULL,
    budget DECIMAL(10,2) DEFAULT NULL,

    additional_message TEXT,
    reservation_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_reservations_wedding_date (wedding_date),
    KEY idx_reservations_user_id (user_id),

    CONSTRAINT fk_reservation_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 5. SMART OFFER ENGINE
-- Пази резултата и входните параметри на всяка оферта.
-- =========================================================

CREATE TABLE IF NOT EXISTS offers (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,

    guest_count INT NOT NULL,
    budget DECIMAL(10,2) NOT NULL,
    recommended_package VARCHAR(100) NOT NULL,
    estimated_price DECIMAL(10,2) NOT NULL,
    recommendation_text TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_offers_user_id (user_id),

    CONSTRAINT fk_offers_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 6. AI ЧАТ СЕСИИ
-- =========================================================

CREATE TABLE IF NOT EXISTS chat_sessions (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,

    title VARCHAR(255)
        DEFAULT 'Моята сватбена консултация',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_chat_sessions_user_id (user_id),

    CONSTRAINT fk_chat_sessions_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 7. AI ЧАТ СЪОБЩЕНИЯ
-- =========================================================

CREATE TABLE IF NOT EXISTS chat_messages (
    id INT NOT NULL AUTO_INCREMENT,
    session_id INT NOT NULL,

    sender VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_chat_messages_session_id (session_id),

    CONSTRAINT fk_chat_messages_session
        FOREIGN KEY (session_id)
        REFERENCES chat_sessions(id)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 8. AI СВАТБЕНИ ВИЗУАЛИЗАЦИИ
-- =========================================================

CREATE TABLE IF NOT EXISTS wedding_visualizations (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,

    prompt TEXT NOT NULL,
    image_base64 LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_wedding_visualizations_user_id (user_id),

    CONSTRAINT fk_wedding_visualizations_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 9. СВАТБЕН КОНТЕКСТ
-- Пази Hall Planner, AI анализа и потребителските бележки.
-- Всеки потребител има най-много един контекст.
-- =========================================================

CREATE TABLE IF NOT EXISTS user_wedding_context (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,

    latest_layout_json LONGTEXT,
    latest_layout_analysis LONGTEXT,
    notes TEXT,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_user_wedding_context_user (user_id),

    CONSTRAINT fk_context_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 10. ИЗБРАНИ УСЛУГИ
-- Many-to-many връзка между потребители и услуги.
-- =========================================================

CREATE TABLE IF NOT EXISTS user_selected_services (
    user_id INT NOT NULL,
    service_id INT NOT NULL,

    PRIMARY KEY (user_id, service_id),
    KEY idx_user_selected_services_service_id (service_id),

    CONSTRAINT fk_user_selected_services_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_selected_services_service
        FOREIGN KEY (service_id)
        REFERENCES services(id)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;