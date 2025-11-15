from fastapi import APIRouter, HTTPException
import numpy as np
import time
import uuid
from datetime import datetime
from app.schemas.prediction import (
    ClinicalData, PredictionResponse, RiskScore,
    ExplanationData, FeatureContribution
)

router = APIRouter()

@router.post("/demo-analyze", response_model=PredictionResponse)
async def demo_analyze(clinical_data: ClinicalData):
    try:
        start_time = time.time()
        
        risk_factor = min(1.0, (clinical_data.hba1c / 10.0 + clinical_data.diabetes_duration / 20.0) / 2)
        
        dr_classes = ["No DR", "Mild NPDR", "Moderate NPDR", "Severe NPDR", "PDR"]
        dr_probs = [
            max(0.0, 0.8 - risk_factor),
            0.1,
            0.05 + risk_factor * 0.2,
            0.05 + risk_factor * 0.3,
            risk_factor * 0.2
        ]
        total = sum(dr_probs)
        dr_probs = [p / total for p in dr_probs]
        predicted_idx = np.argmax(dr_probs)
        
        recommendations = []
        if clinical_data.hba1c > 7.0:
            recommendations.append("🎯 Improve glycemic control - Target HbA1c < 7%")
        if clinical_data.blood_pressure_systolic > 130:
            recommendations.append("💊 Monitor and manage blood pressure")
        if clinical_data.bmi > 25:
            recommendations.append("🏃 Weight management recommended")
        if clinical_data.smoking_status == "current":
            recommendations.append("🚭 Smoking cessation strongly recommended")
        if risk_factor > 0.7:
            recommendations.append("👨‍⚕️ Urgent ophthalmologist consultation required")
        elif risk_factor > 0.4:
            recommendations.append("📅 Schedule follow-up with eye specialist")
        else:
            recommendations.append("✅ Continue current management plan")
        
        follow_up = 1 if risk_factor > 0.7 else 3 if risk_factor > 0.4 else 6
        
        return PredictionResponse(
            prediction_id=f"demo_{uuid.uuid4().hex[:12]}",
            timestamp=datetime.now(),
            dr_stage=dr_classes[predicted_idx],
            dr_stage_probability=dr_probs[predicted_idx],
            dr_class_probabilities=dict(zip(dr_classes, dr_probs)),
            overall_risk_score=RiskScore(
                value=risk_factor,
                category="High" if risk_factor > 0.7 else "Moderate" if risk_factor > 0.4 else "Low",
                confidence=0.88
            ),
            nephropathy_risk=RiskScore(
                value=min(1.0, risk_factor * 1.1),
                category="High" if risk_factor > 0.6 else "Moderate" if risk_factor > 0.3 else "Low",
                confidence=0.82
            ),
            neuropathy_risk=RiskScore(
                value=min(1.0, risk_factor * 0.9),
                category="High" if risk_factor > 0.7 else "Moderate" if risk_factor > 0.4 else "Low",
                confidence=0.79
            ),
            cardiovascular_risk=RiskScore(
                value=min(1.0, risk_factor * 1.05),
                category="High" if risk_factor > 0.65 else "Moderate" if risk_factor > 0.35 else "Low",
                confidence=0.84
            ),
            explanation=ExplanationData(
                image_contribution=0.60,
                clinical_contribution=0.40,
                top_image_features=["Microaneurysms detected", "Hard exudates present", "Retinal hemorrhages"],
                top_clinical_features=[
                    FeatureContribution(
                        feature_name="HbA1c Level",
                        contribution=clinical_data.hba1c / 15.0,
                        normalized_contribution=0.35
                    ),
                    FeatureContribution(
                        feature_name="Diabetes Duration",
                        contribution=clinical_data.diabetes_duration / 50.0,
                        normalized_contribution=0.25
                    ),
                    FeatureContribution(
                        feature_name="Blood Glucose",
                        contribution=clinical_data.blood_glucose / 500.0,
                        normalized_contribution=0.20
                    ),
                ],
                natural_language_explanation=f"Patient shows {dr_classes[predicted_idx]} with HbA1c of {clinical_data.hba1c}% indicating {'poor' if clinical_data.hba1c > 7 else 'good'} glycemic control. Diabetes duration of {clinical_data.diabetes_duration} years is {'a significant' if clinical_data.diabetes_duration > 10 else 'a moderate'} risk factor."
            ),
            recommendations=recommendations,
            follow_up_months=follow_up,
            model_version="v1.0.0-demo",
            processing_time_ms=(time.time() - start_time) * 1000
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": True}