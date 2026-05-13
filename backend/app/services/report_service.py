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
            detail="analyse introuvable!"
        )


def _analysis_belongs_to_user(analysis, current_user: User):
    if current_user.id != analysis.user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cette analyse n'appartient pas à cet utilisateur.!"
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
    user,
):
    def resolve(path):
        if not path:
            return None
        for p in [path, os.path.join(os.getcwd(), path)]:
            if os.path.isfile(p):
                return p
        return None

    pdf = FPDF()
    pdf.add_page()
    pdf.set_margins(15, 10, 15)
    W = 180  # largeur utile

    # ── 1. Header ────────────────────────────────────────────────
    pdf.set_fill_color(30, 100, 200)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Arial", "B", 18)
    pdf.cell(W, 14, "Smart Medical Analysis Report", border=0, ln=1, align="C", fill=True)
    pdf.ln(4)

    # ── 2. Infos patient ─────────────────────────────────────────
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Arial", "B", 10)
    pdf.cell(30, 7, "Patient:", ln=0)
    pdf.set_font("Arial", "", 10)
    pdf.cell(0, 7, str(user.full_name), ln=1)

    pdf.set_font("Arial", "B", 10)
    pdf.cell(30, 7, "Email:", ln=0)
    pdf.set_font("Arial", "", 10)
    pdf.cell(0, 7, str(user.email), ln=1)

    pdf.set_font("Arial", "B", 10)
    pdf.cell(30, 7, "Created at:", ln=0)
    pdf.set_font("Arial", "", 10)
    pdf.cell(0, 7, created_at.strftime("%Y-%m-%d %H:%M"), ln=1)

    pdf.ln(3)
    pdf.set_draw_color(180, 180, 180)
    pdf.line(15, pdf.get_y(), 195, pdf.get_y())
    pdf.ln(4)

    # ── 3. Results ───────────────────────────────────────────────
    pdf.set_font("Arial", "B", 13)
    pdf.cell(0, 8, "Results", ln=1)

    pdf.set_font("Arial", "B", 10)
    pdf.cell(30, 7, "Prediction:", ln=0)
    pdf.set_font("Arial", "B", 11)
    if (prediction or "").lower() == "pneumonia":
        pdf.set_text_color(200, 0, 0)
    else:
        pdf.set_text_color(0, 150, 0)
    pdf.cell(0, 7, (prediction or "").upper(), ln=1)

    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Arial", "B", 10)
    pdf.cell(30, 7, "Confidence:", ln=0)
    pdf.set_font("Arial", "B", 11)
    pdf.cell(0, 7, f"{probability:.2%}", ln=1)

    pdf.ln(3)
    pdf.line(15, pdf.get_y(), 195, pdf.get_y())
    pdf.ln(4)

    # ── 4. Images côte à côte ─────────────────────────────────────
    pdf.set_font("Arial", "B", 13)
    pdf.cell(0, 8, "Images", ln=1)

    IMG_W = 85
    IMG_H = 65
    x_left  = 15
    x_right = 110
    y_labels = pdf.get_y()

    # Labels
    pdf.set_font("Arial", "B", 9)
    pdf.set_xy(x_left, y_labels)
    pdf.cell(IMG_W, 6, "Original Image", align="C", ln=0)
    pdf.set_xy(x_right, y_labels)
    pdf.cell(IMG_W, 6, "Heatmap (AI Explanation)", align="C", ln=1)

    y_imgs = pdf.get_y()

    # Image gauche
    real_orig = resolve(original_image_path)
    if real_orig:
        pdf.image(real_orig, x=x_left, y=y_imgs, w=IMG_W, h=IMG_H)
    else:
        pdf.set_xy(x_left, y_imgs)
        pdf.set_font("Arial", "", 9)
        pdf.cell(IMG_W, IMG_H, "Original image not found", border=1, align="C")

    # Image droite
    real_heat = resolve(heatmap_path)
    if real_heat:
        pdf.image(real_heat, x=x_right, y=y_imgs, w=IMG_W, h=IMG_H)
    else:
        pdf.set_xy(x_right, y_imgs)
        pdf.set_font("Arial", "", 9)
        pdf.cell(IMG_W, IMG_H, "Heatmap not found", border=1, align="C")

    pdf.set_y(y_imgs + IMG_H + 6)

    # ── 5. Interpretation ────────────────────────────────────────
    pdf.set_font("Arial", "B", 13)
    pdf.cell(0, 8, "Interpretation:", ln=1)

    pdf.set_fill_color(235, 245, 255)
    pdf.set_font("Arial", "", 10)
    pdf.set_draw_color(180, 180, 180)
    items = [
        "[ R ]  Red zones indicate potential pneumonia regions",
        "[ B ]  Blue zones indicate normal areas",
        "[ - ]  Heatmap explains AI decision",
    ]
    for item in items:
        pdf.cell(W, 8, item, border="B", ln=1, fill=True)

    pdf.ln(8)

    # ── 6. Footer ────────────────────────────────────────────────
    pdf.line(15, pdf.get_y(), 195, pdf.get_y())
    pdf.ln(2)
    pdf.set_font("Arial", "I", 8)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(W, 8, "Smart Medical App - AI Powered Diagnosis", align="C")

    pdf.output(file_path)

def generate_report_for_analysis(db: Session, current_user: User, analysis_id: int):
    analysis = get_analysis_by_id(db, analysis_id)
    _analysis_exists(analysis)
    _analysis_belongs_to_user(analysis, current_user)

    existing_report = get_report_by_analysis_id(db, analysis_id)
    if existing_report:
        return {
            "message": "Le rapport existe déjà.!",
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
        "message": "Rapport généré avec succès.!",
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
            detail="Report introuvable!"
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