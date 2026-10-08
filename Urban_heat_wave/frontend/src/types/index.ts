export type MapLayerType = 'hvi' | 'lst' | 'ndvi' | 'ndbi' | 'cluster';

export type RiskCategory = 'Low' | 'Moderate' | 'High' | 'Extreme';

export interface ObservationMetadata {
  satellite_sensor: string;
  satellite_observation_date: string;
  spatial_resolution: string;
  weather_source: string;
  weather_timestamp: string;
}

export interface WardMetrics {
  ward_id: string;
  ward_code: string;
  ward_name: string;
  zone: string;
  area_sqkm: number;
  hvi_score: number;
  risk_tier: RiskCategory;
  lst_mean_celsius: number;
  ndvi_mean: number;
  ndbi_mean: number;
  population_density: number;
  cluster_id: number;
  cluster_name: string;
  is_demo_data: boolean;
  observation_metadata: ObservationMetadata;
}

export interface CurrentWeather {
  latitude: number;
  longitude: number;
  air_temp_celsius: number;
  relative_humidity_pct: number;
  heat_index_celsius: number;
  wind_speed_kmh: number;
  precipitation_mm: number;
  recorded_at: string;
  data_source: string;
  is_demo_data: boolean;
}

export interface HistoricalPoint {
  date: string;
  air_temp_celsius: number;
  lst_mean_celsius: number;
  heat_index_celsius: number;
}

export interface CitySummary {
  city_name: string;
  total_wards: number;
  average_hvi: number;
  average_lst: number;
  highest_risk_ward: string;
  lowest_risk_ward: string;
  extreme_wards_count: number;
  high_wards_count: number;
  moderate_wards_count: number;
  low_wards_count: number;
}

export interface LayerConfig {
  id: MapLayerType;
  label: string;
  unit: string;
  description: string;
  propertyKey: string;
  colors: string[];
  stops: [number, string][];
  formatValue: (val: number | string) => string;
}

// Machine Learning Types
export interface ClusterArchetype {
  name: string;
  description: string;
  color: string;
}

export interface ClusterCentroid {
  lst_mean_celsius: number;
  ndvi_mean: number;
  ndbi_mean: number;
  population_density: number;
}

export interface ClusteringSummary {
  n_clusters: number;
  silhouette_score: number;
  is_fitted: boolean;
  engine_type: string;
  archetypes: Record<number, ClusterArchetype>;
  centroids: Record<number, ClusterCentroid>;
}

export interface RegressionCoefficients {
  ndvi_slope: number;
  ndbi_slope: number;
  pop_density_slope: number;
}

export interface RegressionSummary {
  is_fitted: boolean;
  r2_score: number;
  intercept: number;
  coefficients: RegressionCoefficients;
  interpretation: string;
}

export interface MLSummaryResponse {
  clustering: ClusteringSummary;
  regression: RegressionSummary;
  total_wards_analyzed: number;
  status: string;
}

export interface SimulationRequest {
  ward_id: string;
  delta_ndvi: number;
  delta_ndbi: number;
  base_lst: number;
  base_ndvi: number;
  base_ndbi: number;
  base_pop_density: number;
  base_hvi: number;
}

export interface SimulationResponse {
  ward_id: string;
  inputs: {
    delta_ndvi: number;
    delta_ndbi: number;
    base_ndvi: number;
    base_ndbi: number;
    new_ndvi: number;
    new_ndbi: number;
  };
  results: {
    base_lst_celsius: number;
    simulated_lst_celsius: number;
    delta_lst_celsius: number;
    base_hvi: number;
    simulated_hvi: number;
    delta_hvi: number;
    base_risk_tier: RiskCategory;
    simulated_risk_tier: RiskCategory;
    tier_improved: boolean;
  };
}
