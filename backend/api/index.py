from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from backend!"}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.endpoints import prediction

app = FastAPI(
    title="Diabetic AI System",
    description="Explainable Multimodal AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction.router, prefix="/api/v1/prediction", tags=["Prediction"])

@app.get("/")
async def root():
    return {"message": "Diabetic AI System", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# This is required for Vercel
handler = app