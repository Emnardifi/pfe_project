from app.models.user import User
from app.repository.analysis_repository import get_analysis_by_id
from app.repository.report_repository import create_report, get_report_by_analysis_id
from app.repository.image_repository import get_image_by_id

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from fpdf import FPDF
from datetime import datetime
from pathlib import Path
import os
from app.repository.report_repository import get_report_by_id
from app.repository.report_repository import delete_report as repo_delete_report


BASE_DIR = Path(__file__).resolve().parents[2]


def _resolve_file_path(path: str):
    if not path:
        return None

    path = path.replace("\\", "/")

    if path.startswith("/"):
        path = path[1:]

    full_path = BASE_DIR / path

    if full_path.exists():
        return str(full_path)

    return None


def _analysis_exists(analysis):
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found!"
        )


def _analysis_belongs_to_user(analysis, current_user: User):
    if current_user.id != analysis.user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This analysis doesn't belong to this user!"
        )


def _generate_pdf_path(analysis_id: int, report_dir: str = "reports"):
    os.makedirs(report_dir, exist_ok=True)
    return os.path.join(report_dir, f"report_analysis_{analysis_id}.pdf")


def _create_pdf(
    file_path: str,
    prediction: str,
    probability: float,
    original_image_path: str,
    heatmap_path: str,
    created_at: datetime,
    user
):
    pdf = FPDF()
    pdf.add_page()

    pdf.set_fill_color(30, 144, 255)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 12, "Smart Medical Analysis Report", 0, 1, "C", True)

    pdf.ln(5)
    pdf.set_text_color(0, 0, 0)

    pdf.set_font("Arial", size=10)
    pdf.cell(0, 6, f"Patient: {user.full_name}", ln=True)
    pdf.cell(0, 6, f"Email: {user.email}", ln=True)
    pdf.cell(0, 6, f"Created at: {created_at.strftime('%Y-%m-%d %H:%M')}", ln=True)

    pdf.ln(5)

    pdf.set_font("Arial", "B", 12)
    pdf.cell(0, 10, "Results", ln=True)

    pdf.set_font("Arial", size=12)

    if prediction and prediction.lower() == "pneumonia":
        pdf.set_text_color(255, 0, 0)
    else:
        pdf.set_text_color(0, 128, 0)

    pdf.cell(0, 8, f"Prediction: {prediction}", ln=True)

    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 8, f"Confidence: {probability:.2%}", ln=True)

    pdf.ln(8)

    pdf.set_font("Arial", "B", 12)
    pdf.cell(0, 10, "Images", ln=True)

    real_original_path = _resolve_file_path(original_image_path)
    real_heatmap_path = _resolve_file_path(heatmap_path)

    if real_original_path:
        pdf.image(real_original_path, x=10, w=90)
    else:
        pdf.set_font("Arial", size=10)
        pdf.cell(90, 8, "Original image not found", border=1)

    if real_heatmap_path:
        pdf.image(real_heatmap_path, x=110, w=90)
    else:
        pdf.set_xy(110, pdf.get_y())
        pdf.set_font("Arial", size=10)
        pdf.cell(90, 8, "Heatmap not found", border=1)

    pdf.ln(70)

    pdf.set_font("Arial", size=10)
    pdf.multi_cell(
        0,
        8,
        "Interpretation:\n"
        "- Red zones indicate potential pneumonia regions\n"
        "- Blue zones indicate normal areas\n"
        "- Heatmap explains AI decision"
    )

    pdf.ln(10)

    pdf.set_font("Arial", "I", 8)
    pdf.cell(0, 10, "Smart Medical App - AI Powered Diagnosis", 0, 0, "C")

    pdf.output(file_path)


def generate_report_for_analysis(db: Session, current_user: User, analysis_id: int):
    analysis = get_analysis_by_id(db, analysis_id)
    _analysis_exists(analysis)
    _analysis_belongs_to_user(analysis, current_user)

    existing_report = get_report_by_analysis_id(db, analysis_id)
    if existing_report:
        return {
            "message": "Report already exists!",
            "report": existing_report
        }

    image = get_image_by_id(db, analysis.image_id)

    pdf_path = _generate_pdf_path(analysis_id)

    _create_pdf(
        file_path=pdf_path,
        prediction=analysis.prediction,
        probability=analysis.probability,
        original_image_path=image.stored_path if image else None,
        heatmap_path=analysis.heatmap_path,
        created_at=analysis.created_at,
        user=current_user
    )

    report = create_report(
        db,
        analysis_id,
        pdf_path,
        status="generated"
    )

    return {
        "message": "Report generated successfully!",
        "report": report
    }


def get_report_details(db: Session, analysis_id: int, current_user: User):
    analysis = get_analysis_by_id(db, analysis_id)
    _analysis_exists(analysis)
    _analysis_belongs_to_user(analysis, current_user)

    report = get_report_by_analysis_id(db, analysis_id)

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found!"
        )

    return report

def delete_report_service(
    db: Session,
    current_user: User,
    report_id: int
):
    report = get_report_by_id(db, report_id)

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Rapport introuvable."
        )

    analysis = get_analysis_by_id(db, report.analysis_id)

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analyse liée introuvable."
        )

    _analysis_belongs_to_user(analysis, current_user)

    if report.file_path and os.path.exists(report.file_path):
        os.remove(report.file_path)

    repo_delete_report(db, report)

    return {
        "message": "Rapport supprimé avec succès."
    }