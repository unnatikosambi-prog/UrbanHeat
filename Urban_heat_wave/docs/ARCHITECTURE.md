# UrbanHeat — System Architecture & Scientific Documentation

## 1. Overview
UrbanHeat is an Urban Heat Intelligence and Risk Mapping Platform designed for **Greater Mumbai, India**. The platform disaggregates atmospheric weather observations from satellite-derived surface temperature skin observations.

## 2. Scientific Data Disaggregation
- **Air Temperature ($T_{air}$)**: 2m height ambient temperature measured by meteorological stations (Open-Meteo API). Updated hourly.
- **Apparent Temperature / Heat Index ($HI$)**: Human-perceived temperature combining air temp and relative humidity (Steadman formula).
- **Land Surface Temperature ($LST$)**: Radiative skin temperature of roofs, concrete, and vegetation derived from satellite thermal sensors (USGS Landsat-9 TIRS Band 10). Periodic revisit cycle (16 days).
- **Vegetation Index ($NDVI$)**: Canopy greenness index derived from Sentinel-2 MSI optical bands.
- **Built-up Index ($NDBI$)**: Concrete/impervious density index derived from Sentinel-2 MSI SWIR/NIR bands.

## 3. Data Science Component
- **Transparent Baseline Heat Risk Index (HVI)**: Deterministic composite score (0–100) weighting $LST$, $NDBI$, vegetation deficit ($1 - NDVI$), $Heat\ Index$, and population density.
- **Unsupervised K-Means Clustering**: Groups 24 MCGM Mumbai wards into 3 physical archetypes:
  1. *Concrete Thermal Hotspot* (e.g. Dharavi, Kurla, Dongri)
  2. *Vegetated Thermal Buffer* (e.g. Sanjay Gandhi National Park, Aarey, Malabar Hill)
  3. *Coastal Moderate Microclimate* (e.g. Colaba, Bandra West, Versova)
- **Empirical LST Regression**: Quantifies marginal temperature reduction from vegetation ($NDVI$) vs concrete ($NDBI$).

## 4. Phase 1 Architecture
- **Frontend**: Vite + React 18 + TypeScript + MapLibre GL JS + Recharts + Tailwind CSS.
- **Backend**: Python FastAPI service delivering spatial GeoJSON and ward metrics.
- **Data Store**: Preprocessed static GeoJSON (`data/mcgm_wards.geojson`) and structured metrics (`data/mumbai_satellite_ward_metrics.json`). All demo values are explicitly tagged `is_demo_data: true`.
