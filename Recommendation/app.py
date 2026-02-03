from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="ShareSpace Recommendation Service")

# ---------------- Input Schema ----------------
class RecommendationIn(BaseModel):
    category_match: float   # C (0–1)
    popularity: float       # P (0–1)
    location: float         # L (0–1)
    history: float          # H (0–1)

# ---------------- Weights ----------------
ALPHA = 0.4
BETA = 0.3
GAMMA = 0.2
DELTA = 0.1

# ---------------- Recommendation API ----------------
@app.post("/predict")
def recommend(payload: RecommendationIn):

    score = (
        ALPHA * payload.category_match +
        BETA  * payload.popularity +
        GAMMA * payload.location +
        DELTA * payload.history
    )

    return {
        "recommendation_score": round(score, 3)
    }
