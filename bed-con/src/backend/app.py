from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)
app.secret_key = "super-secret-key"  # keep as-is for now

# -------------------- Pages --------------------

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/register_page")
def register_page():
    return render_template("register.html")

@app.route("/about_page")
def about_page():
    return render_template("about.html")

@app.route("/dashboard_page")
def dashboard_page():
    return render_template("dashboard.html")

@app.route("/admin_dashboard_page")
def admin_dashboard_page():
    return render_template("admin_dashboard.html")

# -------------------- CHATBOT PROXY (IMPORTANT) --------------------

CHATBOT_URL = "http://chatbot:5001/chat"

@app.route("/api/chat", methods=["POST"])
def chat_proxy():
    data = request.get_json()
    user_message = data.get("message") if data else None

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        response = requests.post(
            CHATBOT_URL,
            json={"message": user_message},
            timeout=30
        )

        return jsonify(response.json()), response.status_code

    except Exception as e:
        import traceback
        traceback.print_exc()   # 🔥 THIS IS THE KEY
        return jsonify({"error": str(e)}), 500



# -------------------- Run App --------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
