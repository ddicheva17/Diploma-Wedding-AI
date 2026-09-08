from database.mysql import get_mysql_connection


def get_user_wedding_context(user_id):
    """
    Връща AI паметта, избраните услуги и Hall Planner контекста.
    """

    if not user_id:
        return ""

    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                latest_layout_json,
                latest_layout_analysis,
                notes,
                updated_at
            FROM user_wedding_context
            WHERE user_id = %s
            LIMIT 1
        """, (user_id,))

        context = cursor.fetchone()

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

        cursor.close()
        conn.close()

        selected_services = [
            row["name"]
            for row in service_rows
            if row.get("name")
        ]

        services_text = (
            ", ".join(selected_services)
            if selected_services
            else "няма избрани услуги"
        )

        # Може да има избрани услуги и без wedding context запис
        context = context or {}

        layout_info = (
            "Има запазено последно оформление на залата."
            if context.get("latest_layout_json")
            else "Няма запазено оформление на залата."
        )

        layout_analysis = (
            context.get("latest_layout_analysis")
            or "няма направен AI анализ на залата"
        )
        notes = context.get("notes") or "няма бележки"
        updated_at = context.get("updated_at") or "няма информация"

        return f"""
AI памет на потребителя:

- Избрани услуги: {services_text}
- Бележки: {notes}
- Оформление на залата: {layout_info}
- Последен AI анализ на залата: {layout_analysis}
- Последна актуализация: {updated_at}

Използвай тази информация като допълнителна памет
за избраните услуги, Hall Planner-а,
AI анализа и предпочитанията на потребителя.
"""

    except Exception as error:
        print("Wedding context error:", error)
        return ""


def get_user_reservation_context(user_id):
    """
    Връща официалните данни от последната резервация.
    """

    if not user_id:
        return ""

    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                wedding_date,
                guest_count,
                wedding_season,
                wedding_style,
                budget,
                additional_message,
                reservation_status,
                created_at
            FROM reservations
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT 1
        """, (user_id,))

        reservation = cursor.fetchone()

        cursor.close()
        conn.close()

        if not reservation:
            return ""

        wedding_date = (
            reservation.get("wedding_date")
            or "не е посочена"
        )
        guest_count = (
            reservation.get("guest_count")
            or "не е посочен"
        )
        wedding_season = (
            reservation.get("wedding_season")
            or "не е посочен"
        )
        wedding_style = (
            reservation.get("wedding_style")
            or "не е посочен"
        )
        budget = reservation.get("budget") or "не е посочен"
        additional_message = (
            reservation.get("additional_message")
            or "няма бележки"
        )
        reservation_status = (
            reservation.get("reservation_status")
            or "няма статус"
        )
        created_at = (
            reservation.get("created_at")
            or "няма информация"
        )

        return f"""
Официални данни от резервацията на текущия потребител:

- Дата на сватбата: {wedding_date}
- Брой гости: {guest_count}
- Сезон: {wedding_season}
- Стил: {wedding_style}
- Бюджет: {budget} €
- Допълнителни бележки: {additional_message}
- Статус: {reservation_status}
- Създадена на: {created_at}

Използвай тези данни като основна и официална
информация за сватбата.
"""

    except Exception as error:
        print("Reservation context error:", error)
        return ""