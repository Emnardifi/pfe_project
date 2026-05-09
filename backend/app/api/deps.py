from fastapi import Depends,HTTPException,status
# Outil FastAPI pour lire automatiquement le token Bearer
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import SessionLocal,get_bd
from app.core.security import create_access_token,decode_token
# Modèle User pour récupérer l'utilisateur depuis la base
from app.models.user import User
from app.repository.user_repository import get_user_by_email

#definir le sys de recuperation du token :lit le token depuis req http:lire le token après login
# tokenUrl doit pointer vers ta route de login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

#dependance:recuperatio de current user connecte
def get_current_user(
    token:str=Depends(oauth2_scheme),
    db:Session=Depends(get_bd)
) ->User:
    #preparation de message d erreur:token invalid or user invalid
    exception=HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token invalide ou utilisateur non authentifié",
        headers={"WWW-Authenticate": "Bearer"},
    )
    #decoder le token
    payload=decode_token(token)
    #si token invalid/expiré
    if payload is None:
        raise exception

    #recuperation de l email(sub)
    email=payload.get("sub")
    #si email n existe pas 
    if email is None:
        raise exception
    
    #chercher user dans db 
    user =get_user_by_email(db, email)
    #si pas user 
    if user is None:
        raise exception
    
    return user

#fonct: verifier si user est admin
def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé : administrateur uniquement"
        )

    return current_user