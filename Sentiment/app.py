from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="ShareSpace Sentiment Service")

class SentimentIn(BaseModel):
    text: str

@app.post("/predict")
def predict_sentiment(payload: SentimentIn):
    text = payload.text.lower()

    if any(w in text for w in ["good", "great", "excellent", "love"]):
        sentiment = "positive"
    elif any(w in text for w in ["bad", "poor", "worst", "hate"]):
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return {"sentiment": sentiment}
