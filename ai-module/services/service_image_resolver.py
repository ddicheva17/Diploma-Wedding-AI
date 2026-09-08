import json
from pathlib import Path


def _find_project_root():
    """
    Намира основната папка чрез frontend/data/service_images.json.
    """

    current_path = Path(__file__).resolve()

    for parent in current_path.parents:
        json_path = parent / "frontend" / "data" / "service_images.json"

        if json_path.exists():
            return parent

    raise FileNotFoundError(
        "Не е намерен frontend/data/service_images.json"
    )


PROJECT_ROOT = _find_project_root()

SERVICE_IMAGES_FILE = (
    PROJECT_ROOT / "frontend" / "data" / "service_images.json"
)

SERVICE_IMAGES_DIRECTORY = (
    PROJECT_ROOT / "frontend" / "images" / "services"
)


def load_service_images():
    """
    Зарежда каталога с услугите и изображенията.
    """

    with open(SERVICE_IMAGES_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def normalize_text(value):
    """
    Нормализира текст за по-лесно сравнение.
    """

    return str(value or "").strip().lower()


def find_service_key(service_reference):
    """
    Разпознава услуга по service key, официално име или alias.
    """

    reference = normalize_text(service_reference)

    if not reference:
        return None

    catalog = load_service_images()

    if reference in catalog:
        return reference

    for service_key, service_data in catalog.items():
        title = normalize_text(service_data.get("title"))

        if reference == title:
            return service_key

        aliases = service_data.get("aliases", [])
        normalized_aliases = [
            normalize_text(alias)
            for alias in aliases
        ]

        if reference in normalized_aliases:
            return service_key

    return None


def get_service_image(service_reference, image_number):
    """
    Връща конкретно изображение от избрана услуга.
    """

    try:
        image_number = int(image_number)
    except (TypeError, ValueError):
        return None

    if image_number <= 0:
        return None

    catalog = load_service_images()
    service_key = find_service_key(service_reference)

    if not service_key:
        return None

    service_data = catalog.get(service_key, {})
    images = service_data.get("images", [])

    # Потребителската номерация започва от 1
    image_index = image_number - 1

    if image_index < 0 or image_index >= len(images):
        return None

    filename = images[image_index]
    image_path = SERVICE_IMAGES_DIRECTORY / filename
    service_name = service_data.get("title", service_key)

    if not image_path.exists():
        return {
            "success": False,
            "error": "image_file_not_found",
            "service_key": service_key,
            "service_name": service_name,
            "image_number": image_number,
            "filename": filename,
            "image_path": str(image_path)
        }

    return {
        "success": True,
        "service_key": service_key,
        "service_name": service_name,
        "image_number": image_number,
        "filename": filename,
        "image_path": str(image_path)
    }