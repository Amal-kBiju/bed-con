from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import json
import traceback

# 1️⃣ Create Flask app FIRST
app = Flask(__name__)
CORS(app)

# 2️⃣ Create Bedrock client
bedrock = boto3.client(
    service_name="bedrock-runtime",
    region_name="us-east-1"
)

# 3️⃣ Health check (🔥 REQUIRED)
@app.route("/health", methods=["GET"])
def health():
    return "ok", 200


# 4️⃣ Chat endpoint
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        print("👉 Incoming request:", data)

        if not data or "message" not in data:
            return jsonify({"error": "Message is required"}), 400

        msg = data["message"]

        response = bedrock.invoke_model(
            modelId="anthropic.claude-3-sonnet-20240229-v1:0",
            contentType="application/json",
            accept="application/json",
            body=json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": msg}
                        ]
                    }
                ],
                "max_tokens": 300
            })
        )

        raw = response["body"].read()
        print("👉 Raw Bedrock response:", raw)

        result = json.loads(raw)
        reply = result["content"][0]["text"]

        print("👉 Parsed reply:", reply)

        return jsonify({"reply": reply})

    except Exception as e:
        print("❌ BEDROCK ERROR:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# 5️⃣ Run app LAST
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
