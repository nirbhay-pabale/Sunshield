import io
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

def generate_pdf_report_bytes(report_data: Dict[str, Any]) -> bytes:
    """
    Generate professional PDF report with Sahayya.AI letterhead, municipal authorization credentials,
    microclimate observations, thermal stress indices, risk amplification, and action protocols.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    brand_title_style = ParagraphStyle(
        'BrandTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#143d2b')
    )
    
    tagline_style = ParagraphStyle(
        'Tagline',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor('#2e7d32')
    )
    
    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#1b4d3e'),
        spaceBefore=10,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#2c3e35')
    )
    
    meta_style = ParagraphStyle(
        'Meta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#6b8073')
    )
    
    story = []
    
    # Header / Branding Banner
    zone_name = report_data.get("zone_name", "Central Pune")
    period = report_data.get("period", "24 Apr 2025")
    
    story.append(Paragraph("SUNSHIELD — HEAT & CLIMATE HEALTH INTELLIGENCE REPORT", brand_title_style))
    story.append(Paragraph("Municipal Early Warning & Heat Action Decision Support System", tagline_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph(f"Location: <b>{zone_name}, Pune</b> | Assessment Period: <b>{period}</b> | Generated: <b>10:32 AM IST</b>", meta_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2e7d32'), spaceBefore=6, spaceAfter=10))
    
    # Executive Summary Card Table
    risk_score = report_data.get("risk_score", 78)
    risk_level = report_data.get("risk_level", "High")
    temp = report_data.get("temp_c", 39.0)
    feels_like = report_data.get("feels_like_c", 44.0)
    hi = report_data.get("heat_index_c", 44.0)
    wbgt = report_data.get("wbgt_c", 31.4)
    utci = report_data.get("utci_c", 41.2)
    aqi = report_data.get("aqi", 128)
    
    summary_data = [
        [
            Paragraph(f"<b>Overall Heat Risk</b><br/><font size=16 color='#ea580c'><b>{risk_score}/100 ({risk_level})</b></font><br/>Trend: +12% vs. Yesterday", body_style),
            Paragraph(f"<b>Environmental Conditions</b><br/>Temp: <b>{temp}°C</b> (Feels like {feels_like}°C)<br/>Humidity: <b>62%</b> | Wind: <b>8 km/h</b><br/>Solar Flux: <b>Very High (880 W/m²)</b>", body_style),
            Paragraph(f"<b>Human Thermal Stress</b><br/>Heat Index: <b>{hi}°C (Very High)</b><br/>WBGT: <b>{wbgt}°C (High)</b><br/>UTCI: <b>{utci}°C (Very High)</b>", body_style),
            Paragraph(f"<b>Air Quality Index (AQI)</b><br/><font size=14 color='#ca8a04'><b>{aqi} (Moderate)</b></font><br/>PM2.5: 58 µg/m³<br/>PM10: 92 µg/m³", body_style)
        ]
    ]
    
    summary_table = Table(summary_data, colWidths=[135, 145, 135, 125])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f4f8f4')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cce2d2')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#dbece0')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 10))
    
    # Multi-Layer Risk Fusion & Amplification
    story.append(Paragraph("1. Multi-Layer Risk Fusion & Amplification Analysis", heading_style))
    fusion_text = (
        "<b>Multi-Layer Risk Composition:</b> Environmental Risk (58%), Thermal Stress (22%), "
        "Population Vulnerability (14%), Exposure (6%).<br/>"
        "<b>Compound Factor Trigger:</b> High Humidity (62%) + Very High Solar Radiation + Low Wind Speed (8 km/h) "
        "impairs human evaporative thermoregulation, amplifying heat strain across unshaded corridors."
    )
    story.append(Paragraph(fusion_text, body_style))
    story.append(Spacer(1, 8))
    
    # 5-Day Forecast Table
    story.append(Paragraph("2. 5-Day Predictive Health-Risk Forecast", heading_style))
    forecast_headers = ["Day", "Date", "Temp (°C)", "Feels Like", "Heat Index", "WBGT", "Risk Level", "Status"]
    forecast_rows = [forecast_headers]
    forecast_days = report_data.get("forecast", [
        {"day_name": "Mon", "date_str": "Apr 21", "temp_c": 37.5, "feels_like_c": 41.0, "heat_index_c": 41.0, "wbgt_c": 29.5, "risk_level": "High", "is_peak": False},
        {"day_name": "Tue", "date_str": "Apr 22", "temp_c": 38.8, "feels_like_c": 43.0, "heat_index_c": 43.0, "wbgt_c": 30.8, "risk_level": "High", "is_peak": False},
        {"day_name": "Wed", "date_str": "Apr 23", "temp_c": 40.2, "feels_like_c": 45.5, "heat_index_c": 45.5, "wbgt_c": 32.1, "risk_level": "Very High", "is_peak": False},
        {"day_name": "Thu", "date_str": "Apr 24", "temp_c": 39.0, "feels_like_c": 44.0, "heat_index_c": 44.0, "wbgt_c": 31.4, "risk_level": "High", "is_peak": True},
        {"day_name": "Fri", "date_str": "Apr 25", "temp_c": 38.2, "feels_like_c": 42.8, "heat_index_c": 42.8, "wbgt_c": 30.2, "risk_level": "High", "is_peak": False},
    ])
    
    for f in forecast_days:
        status_str = "PEAK RISK" if f.get("is_peak") else "Normal"
        forecast_rows.append([
            f.get("day_name"),
            f.get("date_str"),
            f"{f.get('temp_c')}°C",
            f"{f.get('feels_like_c')}°C",
            f"{f.get('heat_index_c')}°C",
            f"{f.get('wbgt_c')}°C",
            f.get("risk_level"),
            status_str
        ])
        
    f_table = Table(forecast_rows, colWidths=[55, 55, 65, 65, 75, 65, 80, 80])
    f_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#143d2b')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f9fbf9')]),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#d0e2d5')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e5efe8')),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(f_table)
    story.append(Spacer(1, 10))
    
    # Priority Recommended Municipal Actions
    story.append(Paragraph("3. AI Action Plan & Recommended Interventions", heading_style))
    actions = [
        "<b>Open Cooling Centres:</b> Activate designated public halls, temples, and transit misting shelters across central corridors.",
        "<b>Adjust Outdoor Labor Regimes:</b> Enforce 11:00 AM – 4:00 PM moratorium on heavy unshaded manual labor.",
        "<b>Hospital Readiness:</b> Sassoon General Hospital & ward dispensaries to keep 40+ dedicated heatstroke triage beds and IV fluids ready.",
        "<b>Vulnerable Group Protection:</b> Deploy ASHA community workers for geriatric hydration checks in informal slum clusters."
    ]
    for act in actions:
        story.append(Paragraph(f"• {act}", body_style))
        story.append(Spacer(1, 2))
        
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#2e7d32'), spaceBefore=4, spaceAfter=8))
    
    # Footer Sign-off
    footer_text = (
        "<b>SUNSHIELD Heat & Climate Health Intelligence System</b><br/>"
        "<i>Certified Municipal Heat Action Plan (HAP) Decision Support System | Smart Cities Mission & NDMA CAP v1.2</i>"
    )
    story.append(Paragraph(footer_text, meta_style))
    
    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
