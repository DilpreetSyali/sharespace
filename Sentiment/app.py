# FastAPI + VADER sentiment service
from fastapi import FastAPI
from pydantic import BaseModel
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = FastAPI(title="ShareSpace Sentiment Service")
analyzer = SentimentIntensityAnalyzer()

class TextIn(BaseModel):
    text: str

@app.post("/predict")
def predict(payload: TextIn):
    text = (payload.text or "").strip()
    if not text:
        return {"sentiment": "neutral", "score": 0.0}
    scores = analyzer.polarity_scores(text)
    compound = scores["compound"]
    # thresholds tuned for VADER
    if compound >= 0.05:
        label = "positive"
    elif compound <= -0.05:
        label = "negative"
    else:
        label = "neutral"
    return {"sentiment": label, "score": compound}
