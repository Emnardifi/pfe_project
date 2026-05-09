from fastapi import FastAPI

from app.core.database import Base, engine

# importer les modèles pour que SQLAlchemy enregistre les tables
from app.models.user import User
from app.models.image import Image
from app.models.analysis import Analysis
from app.models.report import Report

# importer les routers
from app.api.routes.auth_route import router as auth_router
from app.api.routes.user_route import router as users_router
from app.api.routes.admin_route import router as admin_router
from app.api.routes.analysis_route import router as analyses_router
from app.api.routes.reports_route import router as reports_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
app = FastAPI(
    title="Smart Medical App API",
    version="1.0.0",
    description="API de détection de la pneumonie avec gestion utilisateurs, analyses et rapports PDF"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app.mount(
    "/heatmaps",
    StaticFiles(directory=os.path.join(BASE_DIR, "heatmaps")),
    name="heatmaps"
)
#supp des tab 
#Base.metadata.drop_all(bind=engine)
#print("Tables supp  done.")
# création des tables
Base.metadata.create_all(bind=engine)
print("Tables creation done.")

@app.get("/", tags=["Root"])
def root():
    return {"message": "Smart Medical App backend is running"}

# inclusion des routes
app.include_router(auth_router)      # login / register
app.include_router(users_router)     # profil
app.include_router(analyses_router)  # IA
app.include_router(reports_router)   # PDF
app.include_router(admin_router)     # admin

""" créer les tables dans PostgreSQL
print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables creation done.")

@app.get("/")
def root():
    return {"message" : "backend working"}

@app.get("/test-bd")
def test_bd():
    try:
        connection = engine.connect()
        connection.close()
        return {"message": "DB connected successfully"}
    except Exception as e:
        return {"message": f"DB connection failed: {str(e)}"} """
