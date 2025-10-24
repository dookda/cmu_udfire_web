from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import gee, hotspot

app = FastAPI(
    title="CMU UDFire API",
    description="API for wildfire monitoring using Google Earth Engine",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Docker React container
        "http://localhost:5173",  # Vite dev server (local development)
        "http://localhost:8080",  # Alternative port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(gee.router)
app.include_router(hotspot.router, prefix="/hotspot", tags=["hotspot"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to CMU UDFire API",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "gee": "/gee",
            "hotspot": "/hotspot"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
