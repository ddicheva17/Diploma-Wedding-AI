from flask import Blueprint, jsonify, request

from services.visualization_service import generate_wedding_visualization

visualization_bp = Blueprint("visualization", __name__)


@visualization_bp.route("/visualize", methods=["POST"])
def visualize_wedding():
    try:
        data = request.get_json()
        description = data.get("description", "")

        if not description.strip():
            return jsonify({
                "error": "Моля, въведете описание на сватбата."
            }), 200

        result = generate_wedding_visualization(description)
        return jsonify(result), 200

    except Exception as error:
        print("Wedding Visualization Error:", error)

        return jsonify({
            "error": (
                "Възникна проблем при генерирането на "
                "сватбената визуализация."
            )
        }), 200