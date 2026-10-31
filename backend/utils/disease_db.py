"""
Tomato Guard — disease metadata keyed by class name (must match class_names.json / model output order).
Each entry: shelf_life_days, severity, urgency, storage_tip, treatment_solution, description.
"""

DISEASE_DB = {
    "Bacterial_spot": {
        "shelf_life_days": 4,
        "severity": "High",
        "urgency": "Isolate affected plants and begin copper-based treatment within 24–48 hours.",
        "storage_tip": "Harvest only dry fruit; store at 10–13°C with good airflow. Avoid wetting foliage during packing.",
        "treatment_solution": "Apply copper hydroxide or mancozeb; remove severely infected leaves. Improve spacing and avoid overhead irrigation.",
        "description": "Water-soaked spots with yellow halos on leaves, often spreading in warm, wet conditions.",
    },
    "Early_blight": {
        "shelf_life_days": 5,
        "severity": "Medium",
        "urgency": "Start fungicide program and sanitation this week to slow concentric ring lesions.",
        "storage_tip": "Pick fruit at breaker stage if leaves decline; cool quickly and keep relative humidity moderate.",
        "treatment_solution": "Chlorothalonil or azoxystrobin rotations; mulch soil to reduce splash; prune lower canopy for airflow.",
        "description": "Dark concentric rings on older leaves; common when humidity alternates with warm days.",
    },
    "Late_blight": {
        "shelf_life_days": 3,
        "severity": "Critical",
        "urgency": "Act immediately—late blight spreads fast and can destroy a crop in days.",
        "storage_tip": "Do not store fruit from heavily infected plants; inspect daily and discard soft or oozing fruit.",
        "treatment_solution": "Systemic fungicides (metalaxyl-M, mandipropamid) plus protectants; destroy infected debris; ensure rapid drying of foliage.",
        "description": "Greasy, irregular lesions with white sporulation on undersides in cool, wet weather.",
    },
    "Leaf_Mold": {
        "shelf_life_days": 6,
        "severity": "Medium",
        "urgency": "Improve greenhouse ventilation and begin fungicide within a few days.",
        "storage_tip": "Reduce leaf wetness duration; store produce in drier conditions after harvest.",
        "treatment_solution": "Chlorothalonil or biofungicides; increase air movement; lower RH below 85% where possible.",
        "description": "Yellow patches on top with olive-green mold underneath—typical in high humidity and poor airflow.",
    },
    "Septoria_leaf_spot": {
        "shelf_life_days": 5,
        "severity": "Medium",
        "urgency": "Remove infected lower leaves and apply protectant fungicide to limit defoliation.",
        "storage_tip": "Strong canopy helps fruit quality; after defoliation, prioritize early harvest of exposed fruit.",
        "treatment_solution": "Chlorothalonil or mancozeb; stake plants; avoid working wet foliage to reduce spread.",
        "description": "Small circular spots with dark borders and tiny black fruiting bodies in the center.",
    },
    "Spider_mites_Two-spotted_spider_mite": {
        "shelf_life_days": 7,
        "severity": "Medium",
        "urgency": "Treat before webbing covers leaves—mites reproduce quickly in hot, dry conditions.",
        "storage_tip": "Stressed plants yield softer fruit; maintain field hygiene and avoid dust on leaves.",
        "treatment_solution": "Horticultural oil or miticides; increase brief humidity or overhead rinse where feasible; encourage predators.",
        "description": "Fine stippling, bronzing, and silk webbing on leaf undersides under heat stress.",
    },
    "Target_Spot": {
        "shelf_life_days": 5,
        "severity": "High",
        "urgency": "Begin fungicide rotations soon; lesions expand and merge under prolonged leaf wetness.",
        "storage_tip": "Minimize bruising at harvest; target spot weakens leaves and can sun-scald fruit.",
        "treatment_solution": "Azoxystrobin + chlorothalonil programs; improve drainage and reduce leaf wetness hours.",
        "description": "Brown lesions with concentric rings resembling targets, often after extended humidity.",
    },
    "Tomato_Yellow_Leaf_Curl_Virus": {
        "shelf_life_days": 2,
        "severity": "Critical",
        "urgency": "Remove infected plants to reduce whitefly transmission; no cure—focus on vector control.",
        "storage_tip": "Fruit from mildly affected plants may ripen unevenly; sort and use quickly.",
        "treatment_solution": "Control whiteflies (imidacloprid, reflective mulches, nets); use resistant varieties next season.",
        "description": "Upward leaf curling, yellowing, and stunting spread by whiteflies in warm regions.",
    },
    "Tomato_mosaic_virus": {
        "shelf_life_days": 3,
        "severity": "High",
        "urgency": "Limit spread by sanitizing tools and hands; rogue severely mosaic plants if economically feasible.",
        "storage_tip": "Virus does not make fruit unsafe but can reduce yield; handle plants minimally when wet.",
        "treatment_solution": "No chemical cure—use TMV-free seed, resistant cultivars, and strict hygiene (smoke/alcohol sanitize).",
        "description": "Mottled light and dark green patterns on leaves, sometimes blistering or fern-like growth.",
    },
    "healthy": {
        "shelf_life_days": 14,
        "severity": "None",
        "urgency": "No action needed—continue routine scouting and balanced nutrition.",
        "storage_tip": "Harvest at proper maturity; store ripe tomatoes above 10°C when possible to preserve flavor.",
        "treatment_solution": "Maintain consistent watering, mulch, and preventive IPM; rotate crops responsibly.",
        "description": "Leaves appear uniform in color and texture without lesions, mold, or pest damage.",
    },
    "powdery_mildew": {
        "shelf_life_days": 6,
        "severity": "Medium",
        "urgency": "Treat at first white talcum-like patches—powdery mildew can reduce photosynthesis quickly.",
        "storage_tip": "Keep storage areas dry; infected foliage reduces plant vigor and can affect fruit sizing.",
        "treatment_solution": "Sulfur, potassium bicarbonate, or systemic fungicides labeled for tomatoes; prune for light penetration.",
        "description": "White powdery growth on leaf surfaces, common when nights are cool and days are warm.",
    },
}


def get_disease_info(class_name: str) -> dict:
    """Return disease metadata with safe defaults if key missing."""
    base = DISEASE_DB.get(class_name)
    if base:
        return dict(base)
    return {
        "shelf_life_days": 5,
        "severity": "Unknown",
        "urgency": "Consult an agricultural extension service for confirmation.",
        "storage_tip": "Cool harvested fruit promptly and avoid moisture on the skin.",
        "treatment_solution": "Verify diagnosis with a lab or expert before applying chemicals.",
        "description": "Limited metadata available for this label.",
    }
