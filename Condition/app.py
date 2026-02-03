from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="ShareSpace Condition Service")

class ConditionIn(BaseModel):
    usage_years: float
    defects: str        # none | minor | visible
    usage_type: str     # light | heavy

@app.post("/predict")
def predict_condition(payload: ConditionIn):

    usage = payload.usage_years
    defects = payload.defects.lower()
    usage_type = payload.usage_type.lower()

    if usage < 1 and defects == "none":
        condition = "Good"
    elif defects == "minor":
        condition = "Fair"
    elif defects == "visible" or usage_type == "heavy":
        condition = "Poor"
    else:
        condition = "Fair"

    return {
        "condition": condition
    }
