from app.models.user import User
from app.repository.analysis_repository import (
    create_analysis,
    get_analysis_by_id,
    get_analyses_by_user_id,
)
from app.repository.image_repository import (
    create_image,
    get_image_by_id,
)
from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile,status
import os
import uuid

from app.ai.preprocess import preprocess_image
from app.ai.predict import predict_image
from app.ai.gradcam import generate_gradcam


def _extract_extension(filename: str):
    if "." not in filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file name"
        )
    return filename.rsplit(".", 1)[1].lower()


def _validate_image_extension(extension: str):
    extension_list = {"jpg", "jpeg", "png"}
    if extension not in extension_list:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only jpg, jpeg and png files are allowed"
        )


def _generate_filename(extension: str):
    return f"analysis_{uuid.uuid4().hex}.{extension}"


def _save_upload_file(upload_file, file_path: str):
    try:
        with open(file_path, "wb") as f:
            content = upload_file.file.read()
            f.write(content)
    except Exception as e:
        print("SAVE FILE ERROR:", repr(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la sauvegarde du fichier"
        )


def _run_ai(image_path: str) -> tuple[str, float, str]:
    try:
        preprocessed_image = preprocess_image(image_path)
        prediction_data = predict_image(preprocessed_image)

        prediction = prediction_data["prediction"]
        probability = prediction_data["probability"]

        os.makedirs("heatmaps", exist_ok=True)
        heatmap_path = generate_gradcam(image_path, save_dir="heatmaps")
        heatmap_url = "/" + heatmap_path.replace("\\", "/")

        return prediction, probability, heatmap_url

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"ai prediction failed: {str(e)}"
        )
def create_analysis_service(
    db: Session,
    current_user: User,
    upload_file: UploadFile,
    uploaded_dir: str = "uploads"
):
    file_extension = _extract_extension(upload_file.filename)
    _validate_image_extension(file_extension)

    os.makedirs(uploaded_dir, exist_ok=True)

    stored_filename = _generate_filename(file_extension)
    stored_path = os.path.join(uploaded_dir, stored_filename)

    _save_upload_file(upload_file, stored_path)

    image = create_image(
        db,
        current_user.id,
        upload_file.filename,
        stored_path,
        file_extension
    )

    prediction, probability, heatmap_path = _run_ai(image.stored_path)

    analysis = create_analysis(
        db,
        current_user.id,
        image.id,
        prediction,
        probability,
        heatmap_path,
        status="done"
    )

    return {
        "message": "analysis completed successfully",
        "analysis_id": analysis.id,
        "prediction": analysis.prediction,
        "probability": analysis.probability,
        "heatmap_path": analysis.heatmap_path,
        "status": analysis.status
    }


def get_analysis_details(db: Session, analysis_id: int):
    analysis = get_analysis_by_id(db, analysis_id)
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="analysis not found!"
        )
    return analysis


def get_user_analyses(db: Session, current_user: User):
    return get_analyses_by_user_id(db, current_user.id)


def get_image_details(db: Session, image_id: int):
    image = get_image_by_id(db, image_id)
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="image not found!"
        )
    return image


"""400 : nom de fichier invalide.
415 : type de fichier non accepté.
404 : analyse ou image introuvable.
500 : erreur interne, sauvegarde fichier ou IA."""