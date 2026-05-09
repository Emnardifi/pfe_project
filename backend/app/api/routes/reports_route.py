from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
from app.models.report import Report
from app.models.analysis import Analysis
from app.core.database import get_bd
from app.api.deps import get_current_user, get_current_admin
from app.models.user import User
from app.models.report import Report
from app.repository.analysis_repository import get_analysis_by_id
from app.schemas.report import ReportResponse
from app.services.report_service import (
    generate_report_for_analysis,
    get_report_details
)
from app.repository.report_repository import (
    get_report_by_id,
    delete_report,
    update_report_status,
    get_report_by_analysis_id
)
from app.services.report_service import (
    generate_report_for_analysis,
    get_report_details,
    delete_report_service
)

router = APIRouter(prefix="/reports", tags=["Reports"])

#Générer un rapport PDF
@router.post(
    "/{analysis_id}",
    summary="Générer un rapport PDF depuis une analyse"
)
def create_report(
    analysis_id: int,
    db: Session = Depends(get_bd),
    current_user: User = Depends(get_current_user)
):
    analysis = get_analysis_by_id(db, analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analyse introuvable.")

    if analysis.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès interdit.")

    return generate_report_for_analysis(db, current_user, analysis_id)

#Lister mes rapports
@router.get(
    "/history-report",
    response_model=list[ReportResponse],
    summary="Lister mes rapports"
)
def list_my_reports(
    db: Session = Depends(get_bd),
    current_user: User = Depends(get_current_user)
):
    return (
    db.query(Report)
    .join(Analysis, Report.analysis_id == Analysis.id)
    .filter(Analysis.user_id == current_user.id)
    .all()
    )

#Afficher un rapport précis
@router.get(
    "/{report_id}",
    response_model=ReportResponse,
    summary="Afficher un rapport précis"
)
def get_report(
    report_id: int,
    db: Session = Depends(get_bd),
    current_user: User = Depends(get_current_user)
):
    report = get_report_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Rapport introuvable.")
    
    analysis = get_analysis_by_id(db, report.analysis_id)
    if analysis.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès interdit.")
    
    return report

#Afficher les details rapport d'une analyse
@router.get(
    "/analysis/{analysis_id}",
    summary="Afficher le rapport d'une analyse"
)
def get_report_by_analysis_route(
    analysis_id: int,
    db: Session = Depends(get_bd),
    current_user: User = Depends(get_current_user)
):
    """
    Retourne le rapport lié à une analyse donnée.
    """
    return get_report_details(db, analysis_id, current_user)

#Télécharger le PDF
@router.get(
    "/{report_id}/download",
    summary="Télécharger le PDF"
)
def download_report(
    report_id: int,
    db: Session = Depends(get_bd),
    current_user: User = Depends(get_current_user)
):
    report = get_report_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Rapport introuvable.")
    
    analysis = get_analysis_by_id(db, report.analysis_id)
    if analysis.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès interdit.")
    
    if not os.path.exists(report.file_path):
        raise HTTPException(status_code=404, detail="Fichier PDF introuvable.")

    return FileResponse(
        report.file_path, 
        filename=os.path.basename(report.file_path)
    )

#afficher pdf 
@router.get(
    "/{report_id}/view",
    summary="Afficher le PDF"
)
def view_report(
    report_id: int,
    db: Session = Depends(get_bd),
    current_user: User = Depends(get_current_user)
):
    report = get_report_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Rapport introuvable.")

    analysis = get_analysis_by_id(db, report.analysis_id)
    if analysis.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès interdit.")
    
    if not os.path.exists(report.file_path):
        raise HTTPException(status_code=404, detail="Fichier PDF introuvable.")

    return FileResponse(report.file_path, media_type="application/pdf")

#route de supp 
@router.delete(
    "/{report_id}",
    summary="Supprimer un rapport"
)
def delete_report_exists(
    report_id: int,
    db: Session = Depends(get_bd),
    current_user: User = Depends(get_current_user)
):
    return delete_report_service(db, current_user, report_id)
#route  Générer un rapport s'il n'existe pas 
@router.post(
    "/analysis/{analysis_id}/generate-if-missing",
    summary="Générer un rapport s'il n'existe pas"
)
def generate_report_if_missing(
    analysis_id: int,
    db: Session = Depends(get_bd),
    current_user: User = Depends(get_current_user)
):
    analysis = get_analysis_by_id(db, analysis_id)
    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found!"
        )

    existing_report = get_report_by_analysis_id(db, analysis_id)
    if existing_report:
        raise HTTPException(
            status_code=400,
            detail="Report already exists!"
        )

    return generate_report_for_analysis(db, current_user, analysis_id)