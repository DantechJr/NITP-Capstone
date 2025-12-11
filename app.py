from flask import Flask, render_template, request, jsonify, send_from_directory
from dotenv import load_dotenv
import os
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder="static", template_folder="templates")

# --- Gemini setup with robust auto-selection ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY or not GEMINI_API_KEY.strip():
    raise RuntimeError("GEMINI_API_KEY is missing. Add it to your .env file beside app.py.")

genai.configure(api_key=GEMINI_API_KEY)

# Prefer modern, widely-available models; fall back dynamically
PREFERRED_MODELS = [
    "models/gemini-1.5-flash-latest",
    "models/gemini-1.5-pro",
    "models/gemini-1.0-pro",
]

def pick_model():
    # Try preferred names first
    for name in PREFERRED_MODELS:
        try:
            m = genai.GenerativeModel(name)
            _ = m.generate_content("ping")
            return m
        except Exception:
            continue

    # If all preferred failed, list models and choose one that supports generateContent
    try:
        available = list(genai.list_models())
        supported = [m for m in available if "generateContent" in getattr(m, "supported_generation_methods", [])]
        for m in supported:
            try:
                gm = genai.GenerativeModel(m.name)
                _ = gm.generate_content("ping")
                return gm
            except Exception:
                continue
    except Exception as e:
        raise RuntimeError(f"Could not list models: {e}")

    raise RuntimeError("No available Gemini model supports generateContent for this API key.")

gemini_model = pick_model()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

# Generate recipe (ingredient or dish name only)
@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json(silent=True) or {}
    query = data.get("query", "").strip()

    if not query:
        return jsonify({"result": "⚠️ Please enter an ingredient or dish name."})

    try:
        response = gemini_model.generate_content(
            f"Create a clear, step-by-step Filipino food recipe using: {query}.\n"
            "Include: title, ingredients with quantities and price per ingredients, instructions,  , "
            "estimated time, servings (numbered), total price per batch, and calorie counter. don't add disclaimer in the end."
        )

        recipe = getattr(response, "text", None)
        if not recipe:
            parts = []
            for cand in getattr(response, "candidates", []) or []:
                for p in getattr(getattr(cand, "content", None), "parts", []) or []:
                    if getattr(p, "text", None):
                        parts.append(p.text)
            recipe = "\n".join(parts).strip() if parts else None

        if not recipe:
            return jsonify({"result": "❌ Error generating recipe: Empty response from model."})

        return jsonify({"result": recipe})

    except Exception as e:
        return jsonify({"result": f"❌ Error generating recipe: {str(e)}"})

# Weekly plan (ingredient-based)
@app.route("/weekplan", methods=["POST"])
def weekplan():
    data = request.get_json(silent=True) or {}
    ingredients = data.get("ingredients", "").strip()

    if not ingredients:
        return jsonify({"plan": "⚠️ Please enter some ingredients for the weekly plan."})

    try:
        response = gemini_model.generate_content(
            f"Create a 7-day weekly meal plan using these ingredients: {ingredients}.\n"
            "For each day (Monday–Sunday), include breakfast, lunch, and dinner recipes. "
            "Each recipe should have a title, ingredients with quantities, and short instructions. "
            "At the end, add one helpful cooking or nutrition tip for the week."
        )

        plan = getattr(response, "text", None)
        if not plan:
            parts = []
            for cand in getattr(response, "candidates", []) or []:
                for p in getattr(getattr(cand, "content", None), "parts", []) or []:
                    if getattr(p, "text", None):
                        parts.append(p.text)
            plan = "\n".join(parts).strip() if parts else None

        if not plan:
            return jsonify({"plan": "❌ Error generating weekly plan: Empty response from model."})

        return jsonify({"plan": plan})

    except Exception as e:
        return jsonify({"plan": f"❌ Error generating weekly plan: {str(e)}"})


@app.route("/health")
def health():
    try:
        _ = gemini_model.generate_content("ping")
        return jsonify({"status": "ok"})
    except Exception as e:
        return jsonify({"status": "error", "detail": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
