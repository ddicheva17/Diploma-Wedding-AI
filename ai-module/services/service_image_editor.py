from openai import OpenAI

from config import OPENAI_API_KEY
from services.service_image_request_parser import parse_service_image_request
from services.service_image_resolver import get_service_image

client_openai = OpenAI(api_key=OPENAI_API_KEY, timeout=180.0)


def edit_service_image(service_reference, image_number, instruction):
    """
    Редактира конкретно изображение от каталога с услуги.
    """

    service_image = get_service_image(service_reference, image_number)

    if not service_image:
        return {
            "success": False,
            "error": "service_image_not_found",
            "message": (
                "Не беше намерено изображение "
                "с този номер за избраната услуга."
            )
        }

    if not service_image.get("success"):
        return service_image

    image_path = service_image["image_path"]
    service_name = service_image["service_name"]
    instruction = str(instruction or "").strip()

    if not instruction:
        return {
            "success": False,
            "error": "instruction_not_found",
            "message": (
                "Не е посочено каква промяна "
                "трябва да бъде направена."
            )
        }

    edit_prompt = f"""
Редактирай предоставеното изображение
от сватбената услуга "{service_name}".

Желаната промяна от потребителя е:
{instruction}

Запази максимално близо до оригинала:

- основния обект или композиция;
- формата;
- пропорциите;
- разположението;
- стила;
- декоративните детайли;
- гледната точка;
- общата композиция.

Промени само елементите, които са
необходими според инструкцията
на потребителя.

Не създавай напълно различен дизайн,
освен ако потребителят изрично
не е поискал това.

Ако заявката е за промяна на цвят,
запази останалата част от дизайна
максимално непроменена.

Резултатът трябва да изглежда
реалистично, елегантно и подходящо
за професионално сватбено портфолио.
""".strip()

    try:
        with open(image_path, "rb") as source_image:
            result = client_openai.images.edit(
                model="gpt-image-1",
                image=source_image,
                prompt=edit_prompt,
                # Запазваме тестваната настройка
                input_fidelity="low",
                size="1024x1024"
            )

        if not result.data or not result.data[0].b64_json:
            return {
                "success": False,
                "error": "empty_image_result",
                "message": "AI моделът не върна редактирано изображение."
            }

        edited_image_base64 = result.data[0].b64_json

        return {
            "success": True,
            "service_key": service_image["service_key"],
            "service_name": service_name,
            "image_number": image_number,
            "original_filename": service_image["filename"],
            "instruction": instruction,
            "image_base64": edited_image_base64
        }

    except Exception as error:
        print("Service image edit error:", error)

        return {
            "success": False,
            "error": "image_edit_failed",
            "message": str(error)
        }


def handle_service_image_request(question):
    """
    Обработва цялата заявка за редактиране на изображение от
    разпознаването на услугата до генерирането на новата версия.
    """

    question = str(question or "").strip()

    if not question:
        return {
            "success": False,
            "error": "empty_request",
            "message": "Получена е празна заявка."
        }

    parsed_request = parse_service_image_request(question)

    if not parsed_request.get("success"):
        error_type = parsed_request.get("error")

        if error_type == "service_not_found":
            message = "Не беше разпозната услуга от секция „Услуги“."
        elif error_type == "image_number_not_found":
            message = "Не беше разпознат номер на изображение от услугата."
        else:
            message = (
                "Заявката за редактиране на изображение "
                "не беше разпозната."
            )

        return {
            **parsed_request,
            "message": message
        }

    service_reference = parsed_request["service_reference"]
    image_number = parsed_request["image_number"]
    instruction = parsed_request.get("instruction", "")

    if not instruction:
        return {
            "success": False,
            "error": "instruction_not_found",
            "service_key": parsed_request.get("service_key"),
            "image_number": image_number,
            "message": (
                "Разпознах услугата и изображението, но не е ясно "
                "каква промяна желаете."
            )
        }

    edit_result = edit_service_image(
        service_reference,
        image_number,
        instruction
    )

    if not edit_result.get("success"):
        return edit_result

    return {
        **edit_result,
        "original_question": question,
        "message": (
            f"Готово! Редактирах изображение "
            f"№{image_number} от услугата "
            f"\"{edit_result['service_name']}\" "
            f"според вашето желание."
        )
    }