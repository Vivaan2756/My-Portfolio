import os
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# ✅ Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

# ✅ Portfolio Data
portfolio_data = {
    "name": "Vivaan Patel",
    "about": "Skilled in bridging front-end and back-end development to build interactive, data-driven web applications.Eager to expand expertise into Artificial Intelligence and Machine Learning to build smarter, more innovative applications.",
    "skills": ["HTML", "CSS", "JavaScript", "Python", "Flask", "NumPy", "Pandas"],
    "projects": [
        {"name": "A Todo Flask App", "desc": "A Flask-based app with secured login and logout system."},
        {"name": "TicTacToe Game", "desc": "A two Player Game made with HTML,CSS and JS with a scoredboard system."}
    ],
    "experience": "2+ years in web development, working on full-stack and AI-driven projects.",
    "contact": {"email": "patelvivaan814@gmail.com", "github": "https://github.com/Vivaan2756","linkedin": "https://www.linkedin.com/in/vivaan-patel-b81b21319/"}
}


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/get", methods=["POST"])
def chatbot_response():
    user_msg = request.json.get("message", "").lower().strip()

    # ✅ Greetings
    greetings = {"hi", "hello", "hey", "hii", "hiii", "good morning", "good evening", "good afternoon"}
    if user_msg in greetings:
        return jsonify({"reply": "Hello! 👋 I’m Vivaan’s Portfolio Assistant. You can ask me about Vivaan’s skills, projects, or contact details."})

    # ✅ FAQ direct answers
    if "project" in user_msg:
        projects_info = "Vivaan Patel has two projects: " + ", ".join([p['name'] + " — " + p['desc'] for p in portfolio_data["projects"]])
        return jsonify({"reply": projects_info})

    if "skill" in user_msg:
        skills_info = "Vivaan Patel's key skills are: " + ", ".join(portfolio_data["skills"])
        return jsonify({"reply": skills_info})

    if "experience" in user_msg or "work" in user_msg:
        return jsonify({"reply": f"Vivaan Patel's experience: {portfolio_data['experience']}"})

    if "github" in user_msg or "linkedin" in user_msg or "email" in user_msg or "contact" in user_msg:
        contact = portfolio_data["contact"]
        reply = f"Email: {contact['email']}, GitHub: {contact['github']}, LinkedIn: {contact['linkedin']}"
        return jsonify({"reply": reply})

    # ✅ Otherwise → Gemini fallback
    context = f"""
    You are Vivaan Patel's Portfolio Assistant. 
    Only answer questions about Vivaan Patel's portfolio.
    Name: {portfolio_data['name']}
    About: {portfolio_data['about']}
    Skills: {', '.join(portfolio_data['skills'])}
    Experience: {portfolio_data['experience']}
    Projects: {', '.join([p['name'] + ' - ' + p['desc'] for p in portfolio_data['projects']])}
    Contact: Email {portfolio_data['contact']['email']}, GitHub {portfolio_data['contact']['github']}, LinkedIn {portfolio_data['contact']['linkedin']}
    """
    try:
        response = model.generate_content(context + "\n\nUser: " + user_msg)
        reply = response.text
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"reply": f"⚠️ Error: {str(e)}"})





if __name__ == "__main__":
    app.run(debug=True)

