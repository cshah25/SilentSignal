from flask import Flask, request, jsonify
from handlers import detect_noise, get_readings, classify_sound

app = Flask(__name__)

@app.route("/noise", methods=["POST"])
def noise():
    event = {"body": request.data.decode("utf-8")}
    result = detect_noise.handler(event, None)
    return jsonify(jsonify_safe(result))

@app.route("/readings", methods=["GET"])
def readings():
    event = {"queryStringParameters": dict(request.args)}
    result = get_readings.handler(event, None)
    return jsonify(jsonify_safe(result))

@app.route("/classify", methods=["POST"])
def classify():
    event = {"body": request.data.decode("utf-8")}
    result = classify_sound.handler(event, None)
    return jsonify(jsonify_safe(result))

def jsonify_safe(result):
    # Converts handler-style response dict into a real Flask response
    try:
        body = result.get("body", "{}")
        status_code = result.get("statusCode", 200)
        return jsonify(json.loads(body)), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
