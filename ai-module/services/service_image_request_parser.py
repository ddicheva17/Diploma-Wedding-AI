import re

from services.service_image_resolver import find_service_key, load_service_images

NUMBER_WORDS = {
    "едно": 1,
    "една": 1,
    "първо": 1,
    "първа": 1,
    "две": 2,
    "второ": 2,
    "втора": 2,
    "три": 3,
    "трето": 3,
    "трета": 3,
    "четири": 4,
    "четвърто": 4,
    "четвърта": 4,
    "пет": 5,
    "пето": 5,
    "пета": 5,
    "шест": 6,
    "шесто": 6,
    "шеста": 6,
    "седем": 7,
    "седмо": 7,
    "седма": 7,
    "осем": 8,
    "осмо": 8,
    "осма": 8,
    "девет": 9,
    "девето": 9,
    "девета": 9
}


def normalize_text(value):
    return str(value or "").strip().lower()


def detect_service_reference(text):
    """
    Намира услугата чрез официалното име или aliases
    от service_images.json.
    """

    normalized_text = normalize_text(text)

    if not normalized_text:
        return None

    catalog = load_service_images()

    # Първо проверяваме официалните имена
    for service_key, service_data in catalog.items():
        title = normalize_text(service_data.get("title"))

        if title and title in normalized_text:
            return {
                "service_key": service_key,
                "service_reference": title
            }

    # След това проверяваме aliases, започвайки от най-дългите
    for service_key, service_data in catalog.items():
        aliases = service_data.get("aliases", [])
        sorted_aliases = sorted(
            aliases,
            key=lambda item: len(normalize_text(item)),
            reverse=True
        )

        for alias in sorted_aliases:
            normalized_alias = normalize_text(alias)

            if normalized_alias and normalized_alias in normalized_text:
                return {
                    "service_key": service_key,
                    "service_reference": normalized_alias
                }

    return None


def detect_image_number(text):
    """
    Разпознава номер, изписан с цифра или дума.
    """

    normalized_text = normalize_text(text)

    if not normalized_text:
        return None

    patterns = [
        r"(?:номер|no\.?|№)\s*(\d+)",
        r"(?:снимка|изображение|вариант|модел)\s*(?:номер|№)?\s*(\d+)",
        r"\b(\d+)\b"
    ]

    for pattern in patterns:
        match = re.search(pattern, normalized_text, flags=re.IGNORECASE)

        if match:
            try:
                number = int(match.group(1))

                if number > 0:
                    return number
            except (TypeError, ValueError):
                pass

    for word, number in NUMBER_WORDS.items():
        if re.search(rf"\b{re.escape(word)}\b", normalized_text):
            return number

    return None


def extract_instruction(text, service_reference=None, image_number=None):
    """
    Извлича частта от заявката, която описва желаната промяна.
    """

    original_text = str(text or "").strip()

    if not original_text:
        return ""

    # Най-естественият случай: всичко след „но“
    but_match = re.search(
        r"\bно\b(.+)$",
        original_text,
        flags=re.IGNORECASE
    )

    if but_match:
        instruction = but_match.group(1).strip(" ,.-")

        if instruction:
            return instruction

    change_patterns = [
        r"(?:искам|желая)\s+(?:да\s+)?(?:бъде|е)\s+(.+)$",
        r"(?:промени|променете)\s+(.+)$",
        r"(?:направи|направете)\s+(.+)$",
        r"(?:с|в)\s+(.+)$"
    ]

    for pattern in change_patterns:
        match = re.search(pattern, original_text, flags=re.IGNORECASE)

        if match:
            instruction = match.group(1).strip(" ,.-")

            if instruction:
                return instruction

    return ""


def parse_service_image_request(text):
    """
    Разпознава услугата, номера на изображението и инструкцията.
    """

    normalized_text = normalize_text(text)

    if not normalized_text:
        return {
            "success": False,
            "error": "empty_request"
        }

    service_data = detect_service_reference(normalized_text)

    if not service_data:
        return {
            "success": False,
            "error": "service_not_found"
        }

    service_key = service_data["service_key"]
    service_reference = service_data["service_reference"]

    if not find_service_key(service_reference):
        return {
            "success": False,
            "error": "service_not_found"
        }

    image_number = detect_image_number(normalized_text)

    if not image_number:
        return {
            "success": False,
            "error": "image_number_not_found",
            "service_key": service_key,
            "service_reference": service_reference
        }

    instruction = extract_instruction(
        text,
        service_reference,
        image_number
    )

    return {
        "success": True,
        "service_key": service_key,
        "service_reference": service_reference,
        "image_number": image_number,
        "instruction": instruction
    }