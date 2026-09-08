from flask import Flask
from flask_cors import CORS

from routes.assistant_routes import assistant_bp
from routes.visualization_routes import visualization_bp
from routes.layout_routes import layout_bp
from routes.wedding_engine_routes import wedding_engine_bp

try:
    import sys
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

app = Flask(__name__)
CORS(app)

app.register_blueprint(assistant_bp)
app.register_blueprint(visualization_bp)
app.register_blueprint(layout_bp)
app.register_blueprint(wedding_engine_bp)


@app.route("/")
def home():
    return "Wedding AI Assistant is running."


if __name__ == "__main__":
    app.run(debug=True, port=5000)