import traceback

from flask import Blueprint, jsonify, request

from services.layout_service import (
    analyze_hall_layout,
    generate_hall_layout_plan
)
from services.wedding_engine import get_wedding_engine_data

layout_bp = Blueprint("layout", __name__)


@layout_bp.route("/analyze-layout", methods=["POST"])
def analyze_layout():
    try:
        data = request.get_json()
        layout = data.get("layout", "")

        if not layout:
            return jsonify({
                "analysis": (
                    "Не е получено разпределение на залата за анализ."
                )
            }), 200

        analysis = analyze_hall_layout(layout)

        return jsonify({"analysis": analysis}), 200

    except Exception:
        print("Hall Layout Analysis Error:")
        traceback.print_exc()

        return jsonify({
            "analysis": "Възникна проблем при AI анализа на залата."
        }), 200


@layout_bp.route("/generate-layout", methods=["POST"])
def generate_layout():
    try:
        data = request.get_json()

        description = data.get("description", "")
        user_id = data.get("user_id")

        if not description.strip():
            return jsonify({
                "success": False,
                "message": (
                    "Моля, опишете желаното разпределение на залата."
                )
            }), 200

        wedding_engine_data = get_wedding_engine_data(user_id)
        layout_plan = generate_hall_layout_plan(
            description,
            user_id,
            wedding_engine_data
        )

        return jsonify({
            "success": True,
            "layout_plan": layout_plan
        }), 200

    except Exception:
        print("Generate Layout Error:")
        traceback.print_exc()

        return jsonify({
            "success": False,
            "message": (
                "Възникна проблем при автоматичното генериране на залата."
            )
        }), 200