# UrbanHeat — Urban Heat Intelligence & Risk Mapping Platform (Mumbai)

[![UrbanHeat Phase 1](https://img.shields.io/badge/Status-Phase%201%20Frontend%20%26%20Data%20Foundation-emerald)](https://github.com)

UrbanHeat is a spatial microclimate intelligence web application designed for **Greater Mumbai, India**. The platform synthesizes satellite-derived Land Surface Temperature (LST), atmospheric weather, environmental vegetation/built-up indices (NDVI/NDBI), and administrative ward demographics into an interactive geospatial risk assessment platform.

---

## 1. Project Directory Structure

```
Urban_heat_wave/
├── frontend/             # Vite + React + TypeScript + MapLibre GL JS + Tailwind CSS
│   ├── public/data/      # Bundled static GeoJSON & DEMO datasets for offline dev
│   ├── src/
│   │   ├── components/   # Header, MapView, LayerSelector, MapLegend, Sidebar, Inspector
│   │   ├── constants/    # Layer configurations & color scales
│   │   ├── services/     # API client with automatic backend fallback
│   │   ├── types/        # TypeScript interfaces & types
│   │   ├── App.tsx       # Root layout & state manager
│   │   └── index.css     # Global CSS & glassmorphism utilities
├── backend/              # Python FastAPI REST service
│   ├── app/main.py       # API endpoints (/wards/geojson, /weather/current, /ml/summary)
│   └── requirements.txt  # Python backend dependencies
├── data/                 # Master GeoJSON boundaries & satellite metrics
│   ├── mcgm_wards.geojson                     # 24 MCGM Mumbai Ward Polygons
│   └── mumbai_satellite_ward_metrics.json    # Ward-level thermal metrics
├── ml/                   # Data science interfaces & models
│   └── placeholders.py   # K-Means clustering & LST regression interfaces
├── scripts/              # Helper scripts
│   └── generate_mumbai_geojson.py             # Ward dataset generator
├── docs/                 # Scientific documentation & system architecture
│   └── ARCHITECTURE.md
└── README.md
```

---

## 2. Quick Start Guide

### Running the Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
The frontend dev server will launch at `http://localhost:5173`.

### Running the Backend (Python FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
The API interactive docs will be available at `http://localhost:8000/docs`.

---

## 3. Current DEMO Data Architecture & Provenance

During **Phase 1 UI & Platform Foundation**, all satellite metrics and atmospheric weather parameters are explicitly marked internally with `is_demo_data: true`.

- **Geographic Boundaries**: 24 administrative municipal wards of the Municipal Corporation of Greater Mumbai (MCGM / BMC), formatted from verified public GIS sources (`DataMeet / sanjanakrishnan/mumbai_spatial_data`).
- **Satellite LST & Indices**: Land Surface Temperature (°C), NDVI, and NDBI values are formatted demo metrics replicating Landsat-9 TIRS and Sentinel-2 MSI spatial distributions across Mumbai.
- **Atmospheric Weather**: Current air temperature (32.4°C), relative humidity (74%), and heat index (39.8°C) represent typical Mumbai afternoon conditions.

### Components To Be Replaced with Live Ingestion in Phase 2
1. `fetchCurrentWeather()` in `frontend/src/services/api.ts` -> Will connect directly to live Open-Meteo REST API.
2. `get_mumbai_wards_metrics()` in `backend/app/main.py` -> Will ingest automated Earth Observation raster extractions.
3. `ml/placeholders.py` -> Will run scikit-learn K-Means clustering & Ridge LST regression on real satellite observations.

---

## 4. Scientific Terminology Standards

- **Air Temperature ($T_{air}$)**: 2-meter height ambient air temperature measured by meteorological weather stations.
- **Apparent Temp / Heat Index ($HI$)**: Human-perceived thermal comfort combining air temp and relative humidity.
- **Land Surface Temperature ($LST$)**: Radiative skin temperature of ground surfaces (roofs, concrete, foliage) observed by satellite thermal sensors. *Never labeled as real-time.*
- **Baseline Heat Risk Index ($HVI$)**: Formula-driven composite score (0-100) weighting LST, concrete density (NDBI), vegetation deficit (1 - NDVI), and population density.

---
