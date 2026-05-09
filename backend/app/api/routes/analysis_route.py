from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import FileResponse
from pathlib import Path
from sqlalchemy.orm import Session
import os

from app.core.database import get_bd
from app.api.deps import get_current_user, get_current_admin
from app.models.user import User
from app.schemas.analysis import (
    AnalysisResponse,
    AnalysisResultResponse,
    AnalysisHistoryItem,
    AnalysisDetailResponse
)
from app.services.analysis_service import (
    create_analysis_service,
    get_analysis_details,
    get_user_analyses
)
from app.repository.analysis_repository import get_analysis_by_id, delete_analysis
from app.repository.image_repository import get_image_by_id

router = APIRouter(prefix="/analyses", tags=["Analyses"])

#route prediction 
@router.post(
    "/predict",
    response_model=AnalysisResultResponse,
    summary="Envoyer une image et lancer la prédiction"
)
def predict_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_bd),
    current_user: User = Depends(get_current_user)
):
    return create_analysis_service(db, current_user, file)

#utile côté frontend pour la page Historique
@router.get(
    "/history",
    response_model=list[AnalysisHistoryItem],
    summary="Lister mes analyses(user)"
)
def list_my_analyses(
    db: Session = Depends(get_bd),
    current_user: User = Depends(get_current_user)
):
    return get_user_analyses(db, current_user)

#route utile quand l’utilisateur clique sur une analyse dans son historique.
@router.get(
    "/{analysis_id}",
    response_model=AnalysisDetailResponse,
    summary="Afficher une analyse précise"
)
def get_one_analysis(
    analysis_id: int,
    db: Session = Depends(get_bd),
    current_user: User = Depends(get_current_user)
):
    analysis = get_analysis_details(db, analysis_id)

    if analysis.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès interdit.")

    return analysis

#supp d une analyse
@router.delete(
    "/{analysis_id}",
    summary="Supprimer une analyse"
)
def delete_one_analysis(
    analysis_id: int,
    db: Session = Depends(get_bd),
    current_user: User = Depends(get_current_user)
):
    analysis = get_analysis_by_id(db, analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analyse introuvable.")

    if analysis.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès interdit.")

    delete_analysis(db, analysis)
    return {"message": "Analyse supprimée avec succès."}


#Voir heatmap
@router.get(
    "/{analysis_id}/heatmap",
    summary="Télécharger/voir la heatmap"
)
def get_heatmap_file(
    analysis_id: int,
    db: Session = Depends(get_bd),
    current_user: User = Depends(get_current_user)
):
    analysis = get_analysis_by_id(db, analysis_id)

    if not analysis:
        raise HTTPException(status_code=404, detail="Analyse introuvable.")

    if analysis.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès interdit.")

    if not analysis.heatmap_path:
        raise HTTPException(status_code=404, detail="Chemin heatmap vide.")

    heatmap_path = analysis.heatmap_path.replace("\\", "/")

    if heatmap_path.startswith("/"):
        heatmap_path = heatmap_path[1:]

    file_path = Path(heatmap_path)

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Fichier heatmap introuvable: {file_path}"
        )

    return FileResponse(file_path)
#Voir image originale
@router.get(
    "/{analysis_id}/image",
    summary="Récupérer l'image source de l'analyse"
)
def get_original_image(
    analysis_id: int,
    db: Session = Depends(get_bd),
    current_user: User = Depends(get_current_user)
):
    analysis = get_analysis_by_id(db, analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analyse introuvable.")

    if analysis.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès interdit.")

    image = get_image_by_id(db, analysis.image_id)
    if not image or not os.path.exists(image.stored_path):
        raise HTTPException(status_code=404, detail="Image introuvable.")

    return FileResponse(image.stored_path, filename=image.original_filename)

#recuperation des resultats 
@router.get(
    "/{analysis_id}/result",
    summary="Récupérer le résultat d'une analyse"
)
def get_analysis_result(
    analysis_id: int,
    db: Session = Depends(get_bd),
    current_user: User = Depends(get_current_user)
):
    analysis = get_analysis_by_id(db, analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analyse introuvable.")

    if analysis.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès interdit.")

    return {
        "analysis_id": analysis.id,
        "prediction": analysis.prediction,
        "probability": analysis.probability,
        "status": analysis.status,
        "heatmap_path": analysis.heatmap_path
    }



