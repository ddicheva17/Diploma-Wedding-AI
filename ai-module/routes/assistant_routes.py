import traceback

from flask import Blueprint, jsonify, request
from openai import APIError, AuthenticationError, RateLimitError

from services.assistant_service import generate_ai_response
from services.service_image_editor import handle_service_image_request
from services.service_image_request_parser import parse_service_image_request

assistant_bp = Blueprint("assistant", __name__)


@assistant_bp.route("/ask", methods=["POST"])
def ask_assistant():
    try:
        data = request.get_json() or {}

        question = data.get("question", "")
        history = data.get("history", [])
        user_id = data.get("user_id")

        if not question.strip():
            return jsonify({
                "answer": (
                    "Моля, въведете въпрос, свързан със сватбено планиране."
                )
            }), 200

        # Service image edit request
        parsed_service_request = parse_service_image_request(question)

        if parsed_service_request.get("success"):
            # Image generation requires an actual editing instruction
            instruction = parsed_service_request.get("instruction", "").strip()

            if instruction:
                image_result = handle_service_image_request(question)

                if image_result.get("success"):
                    return jsonify({
                        "answer": image_result.get(
                            "message",
                            "Готово! Създадох редактираната визуализация."
                        ),
                        "type": "service_image",
                        "image": image_result.get("image_base64"),
                        "service_name": image_result.get("service_name"),
                        "image_number": image_result.get("image_number"),
                        "instruction": image_result.get("instruction")
                    }), 200

                return jsonify({
                    "answer": image_result.get(
                        "message",
                        "Не успях да редактирам избраното изображение."
                    )
                }), 200

        # Normal AI assistant flow
        answer = generate_ai_response(question, history, user_id)

        return jsonify({
            "answer": answer,
            "type": "text"
        }), 200

    except RateLimitError:
        return jsonify({
            "answer": (
                "В момента AI услугата няма наличен API лимит или кредити."
            )
        }), 200

    except AuthenticationError:
        return jsonify({
            "answer": "API ключът не е разпознат. Проверете OPENAI_API_KEY."
        }), 200

    except APIError:
        return jsonify({
            "answer": "Възникна временен проблем с AI услугата."
        }), 200

    except Exception:
        print("AI Assistant Full Traceback:")
        traceback.print_exc()

        return jsonify({
            "answer": (
                "Възникна технически проблем при обработката на въпроса."
            )
        }), 200