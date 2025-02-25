from flask import Flask, render_template, request
import os
import re
import requests
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from googlesearch import search
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import TfidfVectorizer
from pdfminer.high_level import extract_text
from docx import Document

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load AI detector model
device = "cuda" if torch.cuda.is_available() else "cpu"
ai_model = AutoModelForSequenceClassification.from_pretrained("roberta-base-openai-detector").to(device)
tokenizer = AutoTokenizer.from_pretrained("roberta-base-openai-detector")

def read_file(file_path):
    ext = file_path.split(".")[-1]
    if ext == "pdf":
        return extract_text(file_path)
    elif ext == "docx":
        doc = Document(file_path)
        return "\n".join([p.text for p in doc.paragraphs])
    elif ext == "txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    return ""

def check_ai_generated(text):
    inputs = tokenizer(text, truncation=True, padding=True, max_length=512, return_tensors="pt").to(device)
    outputs = ai_model(**inputs)
    score = torch.softmax(outputs.logits, dim=1)[0][1].item()  # Probability of AI-generated
    return score

def google_search_check(text):
    query = " ".join(text.split()[:10])  # Take first 10 words for search
    results = []
    try:
        for url in search(query, num_results=3):  # Get top 3 results
            page = requests.get(url, timeout=5)
            soup = BeautifulSoup(page.content, "html.parser")
            page_text = " ".join(p.text for p in soup.find_all("p"))
            results.append((url, page_text))
    except Exception as e:
        print("Google Search Error:", e)
    return results

def check_text_similarity(original_text, web_texts):
    texts = [original_text] + [t[1] for t in web_texts]
    vectorizer = TfidfVectorizer().fit_transform(texts)
    vectors = vectorizer.toarray()
    similarities = (vectors @ vectors.T)[0][1:]
    return [(web_texts[i][0], similarities[i]) for i in range(len(web_texts))]

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        file = request.files["file"]
        if file:
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(file_path)
            text = read_file(file_path)
            ai_score = check_ai_generated(text)
            web_results = google_search_check(text)
            similarity_scores = check_text_similarity(text, web_results)
            return render_template("result.html", ai_score=ai_score, results=similarity_scores)
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
