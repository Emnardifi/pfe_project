#impoort de : base de tous schemas pydantic,valid auto email, config pydantic v2
from pydantic import BaseModel, EmailStr, ConfigDict
#champ facultatif
from typing import Optional
from datetime import datetime

# données envoyées par le frontend lors de l'inscription
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    admin_code: Optional[str] = None

# données retournées par le backend pour afficher un utilisateur
class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime

    # permet de lire directement les objets SQLAlchemy
    model_config = ConfigDict(from_attributes=True)

# données envoyées pour modifier le profil
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    
# données envoyées pour changer le mot de passe
class ChangePassword(BaseModel):
    old_password: str
    new_password: str