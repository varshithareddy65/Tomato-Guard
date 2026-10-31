"""
OpenWeatherMap integration with mock fallback when WEATHER_API_KEY is missing or the request fails.
"""

import os
from typing import Any, Dict

import requests

OWM_URL = "https://api.openweathermap.org/data/2.5/weather"


def _risk_from_humidity(humidity: float) -> str:
    """Map humidity % to fungal disease risk tier."""
    if humidity > 85:
        return "HIGH"
    if humidity >= 70:
        return "MEDIUM"
    return "LOW"


def _farming_advice(temp_c: float, humidity: float, condition_main: str, wind_ms: float) -> str:
    """Generate short, practical advice from current conditions."""
    parts = []
    main = (condition_main or "").lower()

    if temp_c > 32:
        parts.append("Heat stress risk: increase irrigation frequency and consider shade cloth where possible.")
    elif temp_c < 10:
        parts.append("Cold conditions: protect young transplants and delay foliar sprays until temperatures rise.")

    if humidity > 85:
        parts.append("Very high humidity favors fungal pathogens—improve airflow and avoid evening irrigation.")
    elif humidity < 40:
        parts.append("Dry air may favor spider mites—monitor leaf undersides and maintain consistent soil moisture.")

    if "rain" in main or "drizzle" in main:
        parts.append("Rain increases leaf wetness—scout for blights and apply protectants per label if in a high-risk window.")
    elif "clear" in main or "sun" in main:
        parts.append("Good drying conditions—ideal window for canopy management and harvesting dry foliage.")

    if wind_ms > 8:
        parts.append("Strong wind: delay fine-mist spraying; secure stakes and trellis lines.")

    if not parts:
        parts.append("Conditions are moderate—continue regular scouting and balanced fertigation.")

    return " ".join(parts)


def get_weather(lat: float, lon: float) -> Dict[str, Any]:
    """
    Fetch weather for coordinates. Returns keys:
    temperature_c, humidity, condition, wind_speed_ms, disease_risk, farming_advice, is_mock
    """
    api_key = os.getenv("WEATHER_API_KEY", "").strip()

    if not api_key:
        return _mock_weather(lat, lon, reason="no_api_key")

    try:
        params = {
            "lat": lat,
            "lon": lon,
            "appid": api_key,
            "units": "metric",
        }
        resp = requests.get(OWM_URL, params=params, timeout=12)
        resp.raise_for_status()
        data = resp.json()

        temp = float(data["main"]["temp"])
        humidity = float(data["main"]["humidity"])
        wind_ms = float(data.get("wind", {}).get("speed", 0) or 0)
        condition = (data.get("weather") or [{}])[0].get("main", "Unknown")

        risk = _risk_from_humidity(humidity)
        advice = _farming_advice(temp, humidity, condition, wind_ms)

        return {
            "temperature_c": round(temp, 1),
            "humidity": round(humidity, 1),
            "condition": condition,
            "wind_speed_ms": round(wind_ms, 1),
            "disease_risk": risk,
            "farming_advice": advice,
            "is_mock": False,
        }
    except Exception:
        return _mock_weather(lat, lon, reason="api_error")


def _mock_weather(lat: float, lon: float, reason: str) -> Dict[str, Any]:
    """Deterministic-ish mock so the app works offline or without a key."""
    # Simple pseudo-variation from coordinates (not meteorological—demo only)
    seed = (abs(int(lat * 100)) + abs(int(lon * 100))) % 40
    temp = 22.0 + (seed % 10) - 3
    humidity = 55.0 + (seed % 30)
    condition = "Clear"
    if humidity > 80:
        condition = "Clouds"
    wind_ms = 2.0 + (seed % 5)

    risk = _risk_from_humidity(humidity)
    advice = _farming_advice(temp, humidity, condition, wind_ms)

    return {
        "temperature_c": round(temp, 1),
        "humidity": round(humidity, 1),
        "condition": condition,
        "wind_speed_ms": round(wind_ms, 1),
        "disease_risk": risk,
        "farming_advice": advice + f" (Mock data: {reason})",
        "is_mock": True,
    }
