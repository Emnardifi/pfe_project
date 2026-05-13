from app.models.user import User
from app.models.analysis import Analysis
from app.repository.analysis_repository import create_analysis,get_analysis_by_id,get_analyses_by_user_id,get_analyses_by_image_id
from app.repository.report_repository import create_report,get_report_by_id,get_report_by_analysis_id
from app.repository.image_repository import get_image_by_id
from app.core.security import hash_password,verify_password,create_access_token
from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile, File,status #un objet temporaire pour recevoir le fichier envoyé par le client

#helpers
def _analysis_exists(analysis):
    if not analysis:
        raise  HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="analyse  introuvable!"
        )
        
def _analysis_belongs_to_user(analysis,current_user:User):
    if current_user.id!=analysis.user_id and current_user.role != "admin":
        raise  HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=" Cette analyse n'appartient pas à cet utilisateur.!"
        )

#fonct principale
def get_analysis_history_for_user(db:Session,current_user:User):
    return get_analyses_by_user_id(db,current_user.id)

def get_all_history(db:Session,current_user:User,analysis_id:int):
    analysis=get_analysis_by_id(db,analysis_id)
    _analysis_exists(analysis)
    _analysis_belongs_to_user(analysis,current_user)
    image=get_image_by_id(db,analysis.image_id)
    report=get_report_by_analysis_id(db,analysis.id)
    return {
        "analysis":analysis,
        "report":report,
        "image":image
    }