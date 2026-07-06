from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from ..db.mongo import get_collection
from ..core.dependencies import require_role
from typing import List
from datetime import datetime, timedelta
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

router = APIRouter(prefix="/api/mp/reports", tags=["reports"])

# Directory where generated PDF reports are stored on disk
REPORTS_DIR = Path(__file__).resolve().parent.parent / "generated_reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/generate")
async def generate_report(filters: dict, current_user: dict = Depends(require_role("mp"))):
    submissions_collection = await get_collection("submissions")

    period = filters.get("period", "last_30_days")
    ward_filter = filters.get("wards", "all")

    match_stage = {"is_deleted": False}

    if period == "last_30_days":
        since = datetime.utcnow() - timedelta(days=30)
        match_stage["created_at"] = {"$gte": since}
    elif period == "last_quarter":
        since = datetime.utcnow() - timedelta(days=90)
        match_stage["created_at"] = {"$gte": since}
    # "Financial Year 2026" -> no extra date filter for now

    if ward_filter and ward_filter != "all":
        match_stage["ward"] = ward_filter

    total = await submissions_collection.count_documents(match_stage)
    pending = await submissions_collection.count_documents({**match_stage, "status": "pending"})
    in_review = await submissions_collection.count_documents({**match_stage, "status": "in_review"})
    resolved = await submissions_collection.count_documents({**match_stage, "status": "resolved"})
    rejected = await submissions_collection.count_documents({**match_stage, "status": "rejected"})

    theme_pipeline = [
        {"$match": match_stage},
        {"$group": {"_id": "$theme", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    theme_counts = await submissions_collection.aggregate(theme_pipeline).to_list(length=100)

    ward_pipeline = [
        {"$match": match_stage},
        {"$group": {"_id": "$ward", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    ward_counts = await submissions_collection.aggregate(ward_pipeline).to_list(length=100)

    report_id = f"REP-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}"
    generated_at = datetime.utcnow()

    file_path = REPORTS_DIR / f"{report_id}.pdf"
    _build_pdf(
        file_path=file_path,
        report_id=report_id,
        generated_at=generated_at,
        period=period,
        ward_filter=ward_filter,
        total=total,
        pending=pending,
        in_review=in_review,
        resolved=resolved,
        rejected=rejected,
        theme_counts=theme_counts,
        ward_counts=ward_counts,
    )

    summary = f"{total} submissions recorded, {resolved} resolved, {pending} pending review."

    return {
        "report_id": report_id,
        "generated_at": generated_at.isoformat() + "Z",
        "summary": summary,
        "download_url": f"/api/mp/reports/download/{report_id}"
    }


@router.get("/download/{report_id}")
async def download_report(report_id: str, current_user: dict = Depends(require_role("mp"))):
    file_path = REPORTS_DIR / f"{report_id}.pdf"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Report not found")
    return FileResponse(str(file_path), media_type="application/pdf", filename=f"{report_id}.pdf")


def _build_pdf(file_path, report_id, generated_at, period, ward_filter, total, pending, in_review, resolved, rejected, theme_counts, ward_counts):
    doc = SimpleDocTemplate(str(file_path), pagesize=A4, topMargin=2 * cm, bottomMargin=2 * cm)
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle("TitleNavy", parent=styles["Title"], textColor=colors.HexColor("#1B2A4A"))
    heading_style = ParagraphStyle("HeadingNavy", parent=styles["Heading2"], textColor=colors.HexColor("#1B2A4A"), spaceBefore=16)

    elements = []
    elements.append(Paragraph("People's Priorities — Executive Report", title_style))
    elements.append(Paragraph(f"Report ID: {report_id}", styles["Normal"]))
    elements.append(Paragraph(f"Generated: {generated_at.strftime('%d %b %Y, %H:%M UTC')}", styles["Normal"]))
    elements.append(Paragraph(f"Period: {period.replace('_', ' ').title()}  |  Ward Scope: {ward_filter}", styles["Normal"]))
    elements.append(Spacer(1, 20))

    elements.append(Paragraph("Summary", heading_style))
    summary_data = [
        ["Total", "Pending", "In Review", "Resolved", "Rejected"],
        [str(total), str(pending), str(in_review), str(resolved), str(rejected)]
    ]
    summary_table = Table(summary_data, hAlign="LEFT")
    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1B2A4A")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 20))

    elements.append(Paragraph("Submissions by Theme", heading_style))
    theme_data = [["Theme", "Count"]] + [[t["_id"] or "Uncategorized", str(t["count"])] for t in theme_counts]
    theme_table = Table(theme_data, hAlign="LEFT")
    theme_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E2962B")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(theme_table)
    elements.append(Spacer(1, 20))

    elements.append(Paragraph("Submissions by Ward", heading_style))
    ward_data = [["Ward", "Count"]] + [[w["_id"] or "Unknown", str(w["count"])] for w in ward_counts]
    ward_table = Table(ward_data, hAlign="LEFT")
    ward_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4B6B4F")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(ward_table)

    doc.build(elements)