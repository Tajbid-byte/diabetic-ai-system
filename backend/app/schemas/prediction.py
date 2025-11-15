from pydantic import BaseModel, Field
from typing import List, Dict
from datetime import datetime

class ClinicalData(BaseModel):
    age: int = Field(..., ge=0, le=120)
    gender: str
    bmi: float
    hba1c: float
    blood_glucose: float
    blood_pressure_systolic: int
    blood_pressure_diastolic: int
    diabetes_duration: int
    creatinine: float
    cholesterol_total: float
    cholesterol_ldl: float
    cholesterol_hdl: float
    triglycerides: float
    has_hypertension: bool = False
    smoking_status: str = "never"
    family_history: bool = False

class RiskScore(BaseModel):
    value: float
    category: str
    confidence: float

class FeatureContribution(BaseModel):
    feature_name: str
    contribution: float
    normalized_contribution: float

class ExplanationData(BaseModel):
    image_contribution: float
    clinical_contribution: float
    top_image_features: List[str]
    top_clinical_features: List[FeatureContribution]
    natural_language_explanation: str

class PredictionResponse(BaseModel):
    prediction_id: str
    timestamp: datetime
    dr_stage: str
    dr_stage_probability: float
    dr_class_probabilities: Dict[str, float]
    overall_risk_score: RiskScore
    nephropathy_risk: RiskScore
    neuropathy_risk: RiskScore
    cardiovascular_risk: RiskScore
    explanation: ExplanationData
    recommendations: List[str]
    follow_up_months: int
    model_version: str
    processing_time_ms: float