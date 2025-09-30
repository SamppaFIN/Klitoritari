from __future__ import annotations

from flask import Flask, jsonify

app = Flask(__name__)


@app.get("/health")
def health() -> tuple[dict, int]:
    return {"status": "ok"}, 200


@app.get("/hello")
def hello() -> tuple[dict, int]:
    return jsonify({"message": "hello"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=False)


