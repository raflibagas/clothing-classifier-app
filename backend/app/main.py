from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import classification

app = FastAPI(title="Clothing Classifier API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(classification.router, prefix="/api/v1", tags=["classification"])

@app.get("/")
async def root():
    return {"message": "Clothing Classifier API"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "api_version": "1.0"
    }