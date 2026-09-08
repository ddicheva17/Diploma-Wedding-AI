import traceback

from flask import Blueprint, jsonify, request

from services.wedding_engine import get_wedding_engine_data

wedding_engine_bp = Blueprint("wedding_engine", __name__)


@wedding_engine_bp.route("/wedding-engine", methods=["POST"])
def wedding_engine():
    try:
        data = request.get_json()
        user_id = data.get("user_id")

        if not user_id:
            return jsonify({
                "success": False,
                "message": "Липсва потребител."
            }), 200

        engine_data = get_wedding_engine_data(user_id)

        return jsonify({
            "success": True,
            "data": engine_data
        }), 200

    except Exception:
        print("Wedding Engine Error:")
        traceback.print_exc()

        return jsonify({
            "success": False,
            "message": (
                "Възникна проблем при зареждане на Wedding Engine."
            )
        }), 200