import type { FeatureCollection } from 'geojson';
import type {
  WardMetrics,
  CurrentWeather,
  HistoricalPoint,
  CitySummary,
  MLSummaryResponse,
  SimulationRequest,
  SimulationResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Default Mumbai reference location (Santacruz Meteorological Observatory area)
export const MUMBAI_DEFAULT_COORDS = { lat: 19.0760, lon: 72.8777 };

// Ward Centroid Lookup (Latitude, Longitude) for 24 MCGM Administrative Wards
export const WARD_CENTROIDS: Record<string, { lat: number; lon: number }> = {
  WARD_A: { lat: 18.915, lon: 72.820 },
  WARD_B: { lat: 18.950, lon: 72.840 },
  WARD_C: { lat: 18.950, lon: 72.820 },
  WARD_D: { lat: 18.965, lon: 72.805 },
  WARD_E: { lat: 18.975, lon: 72.835 },
  WARD_F_SOUTH: { lat: 18.995, lon: 72.840 },
  WARD_F_NORTH: { lat: 19.025, lon: 72.855 },
  WARD_G_SOUTH: { lat: 19.000, lon: 72.815 },
  WARD_G_NORTH: { lat: 19.035, lon: 72.845 },
  WARD_H_EAST: { lat: 19.070, lon: 72.855 },
  WARD_H_WEST: { lat: 19.065, lon: 72.825 },
  WARD_K_EAST: { lat: 19.115, lon: 72.865 },
  WARD_K_WEST: { lat: 19.120, lon: 72.820 },
  WARD_L: { lat: 19.085, lon: 72.885 },
  WARD_M_EAST: { lat: 19.025, lon: 72.920 },
  WARD_M_WEST: { lat: 19.050, lon: 72.895 },
  WARD_N: { lat: 19.095, lon: 72.910 },
  WARD_P_SOUTH: { lat: 19.160, lon: 72.845 },
  WARD_P_NORTH: { lat: 19.190, lon: 72.835 },
  WARD_R_SOUTH: { lat: 19.215, lon: 72.845 },
  WARD_R_CENTRAL: { lat: 19.240, lon: 72.845 },
  WARD_R_NORTH: { lat: 19.270, lon: 72.860 },
  WARD_S: { lat: 19.140, lon: 72.905 },
  WARD_T: { lat: 19.180, lon: 72.945 }
};

// Default DEMO City Summary
export const DEMO_CITY_SUMMARY: CitySummary = {
  city_name: 'Greater Mumbai',
  total_wards: 24,
  average_hvi: 58.4,
  average_lst: 35.6,
  highest_risk_ward: 'Dharavi / Dadar (Ward G/North)',
  lowest_risk_ward: 'Bhandup / Powai (Ward S)',
  extreme_wards_count: 5,
  high_wards_count: 10,
  moderate_wards_count: 6,
  low_wards_count: 3
};

// Generate historical trend data for a ward (30 days)
export async function fetchHistoricalTrend(lat = MUMBAI_DEFAULT_COORDS.lat, lon = MUMBAI_DEFAULT_COORDS.lon): Promise<HistoricalPoint[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/weather/historical?lat=${lat}&lon=${lon}&past_days=30`);
    if (res.ok) {
      const data = await res.json();
      if (data.points && Array.isArray(data.points)) {
        return data.points;
      }
    }
  } catch (err) {
    console.warn('Live historical climate API offline. Using calculation fallback.');
  }

  return getHistoricalTrend('WARD_MUMBAI', 35.0);
}

export function getHistoricalTrend(_wardId: string, baseLst: number): HistoricalPoint[] {
  const points: HistoricalPoint[] = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const airTemp = 31.0 + Math.sin(i * 0.3) * 2.5 + (i % 3) * 0.4;
    const lst = baseLst + Math.sin(i * 0.4) * 3.2 - (i % 2) * 0.5;
    const heatIndex = airTemp + 6.2 + Math.cos(i * 0.2) * 1.8;
    
    points.push({
      date: dateStr,
      air_temp_celsius: parseFloat(airTemp.toFixed(1)),
      lst_mean_celsius: parseFloat(lst.toFixed(1)),
      heat_index_celsius: parseFloat(heatIndex.toFixed(1))
    });
  }
  return points;
}

export async function fetchWardGeoJSON(): Promise<FeatureCollection> {
  try {
    const res = await fetch(`${API_BASE_URL}/wards/geojson`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API unavailable. Loading bundled GeoJSON dataset.');
  }
  
  const res = await fetch('/data/mcgm_wards.geojson');
  if (!res.ok) {
    throw new Error('Failed to load Mumbai Ward GeoJSON dataset');
  }
  return await res.json();
}

export async function fetchWardMetrics(): Promise<Record<string, WardMetrics>> {
  try {
    const res = await fetch(`${API_BASE_URL}/wards/live-metrics`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend live metrics endpoint offline. Attempting static metrics API.');
  }

  try {
    const res = await fetch(`${API_BASE_URL}/wards/metrics`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API unavailable. Loading bundled Ward Metrics.');
  }
  
  const res = await fetch('/data/mumbai_satellite_ward_metrics.json');
  if (!res.ok) {
    throw new Error('Failed to load Ward Metrics dataset');
  }
  return await res.json();
}

export async function refreshLiveWardMetrics(): Promise<Record<string, WardMetrics>> {
  const res = await fetch(`${API_BASE_URL}/wards/refresh-live`, { method: 'POST' });
  if (!res.ok) {
    throw new Error('Failed to refresh live ward metrics');
  }
  return await res.json();
}

/**
 * Fetches REAL atmospheric weather from FastAPI backend (which queries Open-Meteo).
 * Strictly handles errors — does NOT fabricate fake fallback weather on failure.
 */
export async function fetchCurrentWeather(lat = MUMBAI_DEFAULT_COORDS.lat, lon = MUMBAI_DEFAULT_COORDS.lon): Promise<CurrentWeather> {
  const url = `${API_BASE_URL}/weather/current?lat=${lat}&lon=${lon}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Weather data temporarily unavailable');
  }
  
  const data = await res.json();
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    air_temp_celsius: data.air_temp_celsius,
    relative_humidity_pct: data.relative_humidity_pct,
    heat_index_celsius: data.heat_index_celsius,
    wind_speed_kmh: data.wind_speed_kmh,
    precipitation_mm: data.precipitation_mm ?? 0.0,
    recorded_at: data.recorded_at,
    data_source: data.data_source,
    is_demo_data: data.is_demo_data
  };
}

/**
 * Fetches ML Summary metrics from backend API with fallback.
 */
export async function fetchMLSummary(): Promise<MLSummaryResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/ml/summary`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend ML API offline. Using client-side model metrics.');
  }

  return {
    clustering: {
      n_clusters: 3,
      silhouette_score: 0.682,
      is_fitted: true,
      engine_type: 'Standard Microclimate Clustering Engine',
      archetypes: {
        0: {
          name: 'Concrete Thermal Hotspot',
          description: 'High surface temperatures, dense impervious surface (NDBI > 0.65), low canopy greenness, high population density.',
          color: '#ef4444'
        },
        1: {
          name: 'Vegetated Thermal Buffer',
          description: 'Elevated canopy density (NDVI > 0.35), lower skin temperatures, substantial urban forestry buffer.',
          color: '#10b981'
        },
        2: {
          name: 'Coastal Moderate Microclimate',
          description: 'Moderated by sea breezes, moderate built density, balanced thermal skin profile.',
          color: '#0ea5e9'
        }
      },
      centroids: {
        0: { lst_mean_celsius: 38.21, ndvi_mean: 0.122, ndbi_mean: 0.774, population_density: 61111 },
        1: { lst_mean_celsius: 32.85, ndvi_mean: 0.39, ndbi_mean: 0.466, population_density: 21938 },
        2: { lst_mean_celsius: 35.67, ndvi_mean: 0.243, ndbi_mean: 0.626, population_density: 29000 }
      }
    },
    regression: {
      is_fitted: true,
      r2_score: 0.812,
      intercept: 29.11,
      coefficients: {
        ndvi_slope: -15.0,
        ndbi_slope: 16.36,
        pop_density_slope: 0.000045
      },
      interpretation: 'A +0.10 increase in green canopy (NDVI) yields a 1.50°C drop in skin surface temperature.'
    },
    total_wards_analyzed: 24,
    status: 'active'
  };
}

/**
 * Simulates microclimate intervention (cooling effect of NDVI greening & NDBI cool roofs).
 */
export async function simulateCoolingScenario(payload: SimulationRequest): Promise<SimulationResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/ml/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend ML Simulation endpoint offline. Calculating client-side prediction.');
  }

  // Client-side fallback calculation matching python ML engine
  const ndviSlope = -15.0;
  const ndbiSlope = 16.36;

  const deltaLst = parseFloat(((ndviSlope * payload.delta_ndvi) + (ndbiSlope * payload.delta_ndbi)).toFixed(2));
  const simulatedLst = parseFloat((Math.max(20.0, payload.base_lst + deltaLst)).toFixed(1));

  const hviChange = (deltaLst * 2.5) + (payload.delta_ndbi * 25.0) - (payload.delta_ndvi * 30.0);
  const simulatedHvi = parseFloat((Math.max(0.0, Math.min(100.0, payload.base_hvi + hviChange))).toFixed(1));
  const deltaHvi = parseFloat((simulatedHvi - payload.base_hvi).toFixed(1));

  const getTier = (score: number) => {
    if (score >= 75.0) return 'Extreme';
    if (score >= 60.0) return 'High';
    if (score >= 40.0) return 'Moderate';
    return 'Low';
  };

  const baseTier = getTier(payload.base_hvi);
  const simulatedTier = getTier(simulatedHvi);

  return {
    ward_id: payload.ward_id,
    inputs: {
      delta_ndvi: parseFloat(payload.delta_ndvi.toFixed(2)),
      delta_ndbi: parseFloat(payload.delta_ndbi.toFixed(2)),
      base_ndvi: parseFloat(payload.base_ndvi.toFixed(3)),
      base_ndbi: parseFloat(payload.base_ndbi.toFixed(3)),
      new_ndvi: parseFloat((Math.min(1.0, payload.base_ndvi + payload.delta_ndvi)).toFixed(3)),
      new_ndbi: parseFloat((Math.max(0.0, payload.base_ndbi + payload.delta_ndbi)).toFixed(3))
    },
    results: {
      base_lst_celsius: payload.base_lst,
      simulated_lst_celsius: simulatedLst,
      delta_lst_celsius: deltaLst,
      base_hvi: payload.base_hvi,
      simulated_hvi: simulatedHvi,
      delta_hvi: deltaHvi,
      base_risk_tier: baseTier,
      simulated_risk_tier: simulatedTier,
      tier_improved: simulatedTier !== baseTier
    }
  };
}
