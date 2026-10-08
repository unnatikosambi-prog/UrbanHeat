import type { LayerConfig, MapLayerType } from '../types';

export const LAYER_CONFIGS: Record<MapLayerType, LayerConfig> = {
  hvi: {
    id: 'hvi',
    label: 'Heat Risk Index',
    unit: 'Score 0-100',
    description: 'Composite baseline risk score weighting surface temp, concrete density, vegetation deficit & heat index.',
    propertyKey: 'hvi_score',
    colors: ['#2ec4b6', '#f7b801', '#f15bb5', '#e63946'],
    stops: [
      [20, '#2ec4b6'],
      [45, '#f7b801'],
      [70, '#f15bb5'],
      [85, '#e63946']
    ],
    formatValue: (val) => `${typeof val === 'number' ? val.toFixed(1) : val} / 100`
  },
  lst: {
    id: 'lst',
    label: 'Land Surface Temp (LST)',
    unit: '°C',
    description: 'Radiative skin temperature derived from Landsat-9 TIRS thermal observations (Not real-time air temp).',
    propertyKey: 'lst_mean',
    colors: ['#3b82f6', '#eab308', '#f97316', '#dc2626'],
    stops: [
      [30.0, '#3b82f6'],
      [34.0, '#eab308'],
      [37.0, '#f97316'],
      [39.5, '#dc2626']
    ],
    formatValue: (val) => `${typeof val === 'number' ? val.toFixed(1) : val} °C`
  },
  ndvi: {
    id: 'ndvi',
    label: 'Vegetation Index (NDVI)',
    unit: 'Index (-1 to +1)',
    description: 'Green canopy cover density derived from Sentinel-2 MSI optical spectral bands.',
    propertyKey: 'ndvi_mean',
    colors: ['#ef4444', '#facc15', '#84cc16', '#15803d'],
    stops: [
      [0.05, '#ef4444'],
      [0.20, '#facc15'],
      [0.35, '#84cc16'],
      [0.55, '#15803d']
    ],
    formatValue: (val) => `${typeof val === 'number' ? val.toFixed(2) : val}`
  },
  ndbi: {
    id: 'ndbi',
    label: 'Built-Up Index (NDBI)',
    unit: 'Index (-1 to +1)',
    description: 'Concrete & impervious surface density derived from Sentinel-2 SWIR/NIR bands.',
    propertyKey: 'ndbi_mean',
    colors: ['#38bdf8', '#94a3b8', '#f97316', '#b91c1c'],
    stops: [
      [0.35, '#38bdf8'],
      [0.55, '#94a3b8'],
      [0.72, '#f97316'],
      [0.85, '#b91c1c']
    ],
    formatValue: (val) => `${typeof val === 'number' ? val.toFixed(2) : val}`
  },
  cluster: {
    id: 'cluster',
    label: 'Microclimate Cluster',
    unit: 'Archetype',
    description: 'Unsupervised K-Means clustering grouping wards with similar thermal & physical characteristics.',
    propertyKey: 'cluster_id',
    colors: ['#ef4444', '#22c55e', '#3b82f6'],
    stops: [
      [0, '#ef4444'], // Concrete Hotspot
      [1, '#22c55e'], // Vegetated Buffer
      [2, '#3b82f6']  // Coastal Moderate
    ],
    formatValue: (val) => {
      if (val === 0) return 'Concrete Hotspot';
      if (val === 1) return 'Vegetated Buffer';
      if (val === 2) return 'Coastal Moderate';
      return String(val);
    }
  }
};
