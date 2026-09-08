import json
from openai import OpenAI

from config import OPENAI_API_KEY, OPENAI_TEXT_MODEL

client_openai = OpenAI(api_key=OPENAI_API_KEY)


def summarize_hall_layout(layout_json):
    summary = {
        "round_tables": 0,
        "rectangular_tables": 0,
        "head_tables": 0,
        "dance_floors": 0,
        "wedding_arches": 0,
        "aisles": 0,
        "photo_zones": 0,
        "cake_zones": 0,
        "estimated_seats": 0,
        "elements": []
    }

    try:
        layout_data = json.loads(layout_json)
    except Exception:
        return summary

    def walk_nodes(node):
        attrs = node.get("attrs", {})
        children = node.get("children", [])
        text_value = attrs.get("text", "")

        if text_value:
            if "8 места" in text_value:
                summary["round_tables"] += 1
                summary["estimated_seats"] += 8

            elif "10 места" in text_value:
                summary["rectangular_tables"] += 1
                summary["estimated_seats"] += 10

            elif "Президиум" in text_value:
                summary["head_tables"] += 1

            elif "Дансинг" in text_value:
                summary["dance_floors"] += 1

            elif "Сватбена арка" in text_value:
                summary["wedding_arches"] += 1

            elif "Пътека" in text_value:
                summary["aisles"] += 1

            elif "Фотозона" in text_value:
                summary["photo_zones"] += 1

            elif "Зона за торта" in text_value:
                summary["cake_zones"] += 1

        if node.get("className", "") == "Group":
            summary["elements"].append({
                "x": attrs.get("x"),
                "y": attrs.get("y"),
                "rotation": attrs.get("rotation", 0)
            })

        for child in children:
            walk_nodes(child)

    walk_nodes(layout_data)

    return summary


def analyze_hall_layout(layout):
    layout_summary = summarize_hall_layout(layout)

    analysis_prompt = f"""
    Ти си професионален AI консултант за сватбено планиране
    и анализ на разпределение на сватбена зала.

    Анализирай разположението и върни полезен отговор на български език.

    Обърни внимание на:
    - разположение на масите
    - удобство за гостите
    - видимост към президиума/арка/важни зони
    - достъп до дансинга
    - фотозона
    - зона за торта
    - достатъчно проходи
    - потенциални проблеми
    - конкретни препоръки

    Форматирай отговора с кратки секции:
    1. Обобщение
    2. Силни страни
    3. Потенциални проблеми
    4. Препоръки за подобрение

    Структурирано обобщение на залата:

    Кръгли маси: {layout_summary["round_tables"]}
    Правоъгълни маси: {layout_summary["rectangular_tables"]}
    Маса за младоженците: {layout_summary["head_tables"]}
    Очакван брой места: {layout_summary["estimated_seats"]}
    Дансинг: {layout_summary["dance_floors"]}
    Сватбена арка: {layout_summary["wedding_arches"]}
    Пътека към олтара: {layout_summary["aisles"]}
    Фотозона: {layout_summary["photo_zones"]}
    Зона за торта: {layout_summary["cake_zones"]}

    Konva JSON:
    {layout}
    """

    response = client_openai.chat.completions.create(
        model=OPENAI_TEXT_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "Ти си AI експерт по сватбено планиране, "
                    "разпределение на зали и организация на гости."
                )
            },
            {
                "role": "user",
                "content": analysis_prompt
            }
        ],
        temperature=0.6
    )

    return response.choices[0].message.content


def generate_hall_layout_plan(
    description,
    user_id=None,
    wedding_engine_data=None
):
    context_text = ""

    if wedding_engine_data:
        context_text = f"""
        Данни за сватбата:
        {wedding_engine_data}
        """

    generator_prompt = f"""
    Ти си AI експерт по сватбено планиране и разпределение на зали.

    Задачата ти е да създадеш структуриран JSON план за сватбена зала.

    Описание от потребителя:
    {description}

    {context_text}

    Върни само валиден JSON, без markdown и без обяснения.

    JSON форматът трябва да бъде точно този:

    {{
      "round_tables": 0,
      "rectangular_tables": 0,
      "head_table": true,
      "dance_floor": true,
      "wedding_arch": true,
      "aisle": true,
      "photo_zone": true,
      "cake_zone": true,
      "notes": "кратко описание на логиката на разпределението"
    }}

    Правила:
    - Една кръгла маса има 8 места.
    - Една правоъгълна маса има 10 места.
    - Ако има брой гости, изчисли достатъчно места.
    - За луксозна сватба предпочитай повече пространство и кръгли маси.
    - За по-компактна подредба използвай повече правоъгълни маси.
    - Ако потребителят не посочи друго, включи президиум, дансинг, фотозона и зона за торта.
    - Не връщай никакъв текст извън JSON.
    """

    response = client_openai.chat.completions.create(
        model=OPENAI_TEXT_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "Връщаш само валиден JSON за автоматично "
                    "генериране на сватбена зала."
                )
            },
            {
                "role": "user",
                "content": generator_prompt
            }
        ],
        temperature=0.4
    )

    raw_result = response.choices[0].message.content.strip()

    try:
        return json.loads(raw_result)

    except Exception:
        return {
            "round_tables": 0,
            "rectangular_tables": 0,
            "head_table": True,
            "dance_floor": True,
            "wedding_arch": False,
            "aisle": False,
            "photo_zone": True,
            "cake_zone": True,
            "notes": (
                "AI не върна валиден JSON. "
                "Използван е резервен план."
            )
        }