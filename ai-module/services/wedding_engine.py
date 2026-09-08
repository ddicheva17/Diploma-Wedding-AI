from database.mysql import get_mysql_connection


def get_wedding_engine_data(user_id):
    if not user_id:
        return {
            "progress": 0,
            "reservation": None,
            "selected_services": [],
            "wedding_context": None,
            "visualization": None,
            "offers": [],
            "latest_offer": None,
            "offers_summary": {
                "total_offers": 0,
                "packages": [],
                "minimum_price": None,
                "maximum_price": None
            },
            "next_steps": [],
            "actions": [],
            "summary": "Няма логнат потребител."
        }

    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    # Latest reservation
    cursor.execute("""
        SELECT
            wedding_date,
            guest_count,
            wedding_season,
            wedding_style,
            budget,
            additional_message,
            reservation_status
        FROM reservations
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT 1
    """, (user_id,))

    reservation = cursor.fetchone()

    # Wedding context and Hall Planner
    cursor.execute("""
        SELECT
            latest_layout_json,
            latest_layout_analysis,
            notes
        FROM user_wedding_context
        WHERE user_id = %s
        LIMIT 1
    """, (user_id,))

    wedding_context = cursor.fetchone()

    # Selected services
    cursor.execute("""
        SELECT
            s.name
        FROM user_selected_services uss
        INNER JOIN services s
            ON s.id = uss.service_id
        WHERE uss.user_id = %s
        ORDER BY s.name ASC
    """, (user_id,))

    service_rows = cursor.fetchall()
    selected_services = [
        row["name"]
        for row in service_rows
        if row.get("name")
    ]

    # Latest AI visualization
    cursor.execute("""
        SELECT
            prompt
        FROM wedding_visualizations
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT 1
    """, (user_id,))

    visualization = cursor.fetchone()

    # All offers for the current user
    cursor.execute("""
        SELECT
            id,
            guest_count,
            budget,
            recommended_package,
            estimated_price,
            recommendation_text,
            created_at
        FROM offers
        WHERE user_id = %s
        ORDER BY created_at DESC, id DESC
    """, (user_id,))

    offers = cursor.fetchall()

    cursor.close()
    conn.close()

    latest_offer = offers[0] if offers else None
    offer_prices = []
    offer_packages = []

    for offer in offers:
        estimated_price = offer.get("estimated_price")
        package = offer.get("recommended_package")

        if estimated_price is not None:
            try:
                offer_prices.append(float(estimated_price))
            except (TypeError, ValueError):
                pass

        if package and package not in offer_packages:
            offer_packages.append(package)

    offers_summary = {
        "total_offers": len(offers),
        "packages": offer_packages,
        "minimum_price": min(offer_prices) if offer_prices else None,
        "maximum_price": max(offer_prices) if offer_prices else None
    }

    # Organization progress
    progress = 0
    next_steps = []

    if reservation:
        progress += 20

        if reservation.get("guest_count"):
            progress += 5

        if reservation.get("budget"):
            progress += 5

        if reservation.get("wedding_style"):
            progress += 5

        if reservation.get("wedding_season"):
            progress += 5
    else:
        next_steps.append(
            "Създаване на резервация с дата, гости, стил и бюджет."
        )

    if selected_services:
        progress += 15
    else:
        next_steps.append("Избор на основни услуги за сватбата.")

    if visualization:
        progress += 10
    else:
        next_steps.append("Генериране на AI визуална концепция.")

    if wedding_context and wedding_context.get("latest_layout_json"):
        progress += 15
    else:
        next_steps.append("Създаване на разпределение на залата.")

    if wedding_context and wedding_context.get("latest_layout_analysis"):
        progress += 10
    else:
        next_steps.append("AI анализ на разпределението на залата.")

    if offers:
        progress += 10
    else:
        next_steps.append(
            "Генериране на ориентировъчна сватбена оферта."
        )

    progress = min(progress, 100)

    # Additional services that have not been selected
    if selected_services:
        required_services = [
            "Декорация и стайлинг",
            "Сватбени покани",
            "Сватбени торти",
            "Цялостно сватбено планиране",
            "Заря и пироефекти"
        ]

        missing_services = [
            service
            for service in required_services
            if service not in selected_services
        ]

        for service in missing_services[:3]:
            next_steps.append(
                f"Обмислете добавяне на услуга: {service}."
            )

    # Dashboard actions
    actions = []

    for step in next_steps:
        action = {
            "label": step,
            "url": "dashboard.html",
            "type": "general"
        }

        if "услуга" in step or "торти" in step or "планиране" in step:
            action["url"] = "services.html"
            action["type"] = "services"

        elif "визуална" in step or "визуализация" in step:
            action["url"] = "assistant.html"
            action["type"] = "visualization"

        elif "зала" in step or "разпределение" in step:
            action["url"] = "planner.html"
            action["type"] = "planner"

        elif "резервация" in step:
            action["url"] = "reservations.html"
            action["type"] = "reservation"

        elif "оферта" in step:
            action["url"] = "reservations.html"
            action["type"] = "offer"

        actions.append(action)

    return {
        "progress": progress,
        "reservation": reservation,
        "selected_services": selected_services,
        "wedding_context": wedding_context,
        "visualization": visualization,
        "offers": offers,
        "latest_offer": latest_offer,
        "offers_summary": offers_summary,
        "next_steps": next_steps,
        "actions": actions
    }