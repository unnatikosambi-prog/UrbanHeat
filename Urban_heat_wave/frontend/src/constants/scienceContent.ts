export interface ScienceConcept {
  id: string;
  title: string;
  category: 'Atmospheric' | 'Satellite' | 'Geospatial' | 'Risk & ML';
  shortSummary: string;
  whatItMeans: string;
  whyUrbanHeatUsesIt: string;
  howItRelatesToProject: string;
  iconName?: string;
}

export interface MetricQuickTooltip {
  title: string;
  shortDef: string;
  updateFrequency: string;
  sourceName: string;
  scienceTip: string;
}

export const SCIENCE_CONCEPTS: ScienceConcept[] = [
  {
    id: 'air-temperature',
    title: 'Air Temperature (T_air)',
    category: 'Atmospheric',
    shortSummary: 'Ambient kinetic temperature of air at 2m height above ground.',
    whatItMeans: 'Air Temperature is the standard weather measurement of thermal energy in the atmosphere at human breathing height (2 meters above the ground), shielded from direct solar radiation.',
    whyUrbanHeatUsesIt: 'It measures the actual atmospheric temperature that humans feel and experience when walking outdoors.',
    howItRelatesToProject: 'UrbanHeat fetches live ambient air temperature across Greater Mumbai directly from the Open-Meteo meteorological API.',
    iconName: 'Thermometer'
  },
  {
    id: 'apparent-temperature',
    title: 'Apparent Temperature / Heat Index (HI)',
    category: 'Atmospheric',
    shortSummary: 'Human-perceived temperature combining air temperature and relative humidity.',
    whatItMeans: 'The Heat Index calculates how hot it actually feels to the human body when relative humidity is combined with ambient air temperature. High atmospheric humidity impairs sweat evaporation, reducing the body\'s natural cooling mechanism.',
    whyUrbanHeatUsesIt: 'Because Mumbai is a tropical coastal peninsula, high humidity during pre-monsoon and summer months elevates thermal stress significantly above dry air temperature alone.',
    howItRelatesToProject: 'Calculated dynamically in real-time alongside Open-Meteo weather feeds using the Steadman humidity-temperature equation.',
    iconName: 'Flame'
  },
  {
    id: 'humidity',
    title: 'Relative Humidity (%)',
    category: 'Atmospheric',
    shortSummary: 'Percentage of moisture present in the air relative to maximum saturation.',
    whatItMeans: 'Relative Humidity measures the water vapor content in the air. At 100% humidity, air is fully saturated and sweat cannot evaporate from human skin.',
    whyUrbanHeatUsesIt: 'Mumbai\'s coastal geography surrounded by the Arabian Sea leads to typical afternoon humidity levels of 65%–85%, compounding heatwave severity.',
    howItRelatesToProject: 'Live humidity feeds are displayed in the header weather ticker and sidebar microclimate inspector.',
    iconName: 'Droplets'
  },
  {
    id: 'urban-heat-island',
    title: 'Urban Heat Island (UHI) Effect',
    category: 'Geospatial',
    shortSummary: 'Microclimate phenomenon where urban areas are significantly warmer than surrounding rural zones.',
    whatItMeans: 'The Urban Heat Island effect occurs when natural vegetation is replaced by dense concrete structures, asphalt roads, and roofs. These materials absorb solar radiation during the day and continuously re-radiate heat at night.',
    whyUrbanHeatUsesIt: 'Mumbai contains extreme microclimate disparities—dense commercial and informal settlements absorb high heat, while forested zones like Sanjay Gandhi National Park remain significantly cooler.',
    howItRelatesToProject: 'UrbanHeat disaggregates Mumbai\'s 24 administrative wards to map UHI hotspots and target urban forestry interventions.',
    iconName: 'Building2'
  },
  {
    id: 'land-surface-temperature',
    title: 'Land Surface Temperature (LST)',
    category: 'Satellite',
    shortSummary: 'Radiative skin temperature of roofs, concrete, soil, and vegetation from space.',
    whatItMeans: 'Land Surface Temperature (LST) is the thermal skin temperature of ground surfaces observed by satellite thermal infrared sensors. On sunny afternoons, dark asphalt or concrete roofs can reach 45°C–55°C, while air temperature remains 34°C.',
    whyUrbanHeatUsesIt: 'LST identifies which specific urban materials and wards are physically absorbing and storing thermal energy.',
    howItRelatesToProject: 'Derived from USGS Landsat-9 TIRS Band 10 thermal observations aggregated at the ward polygon level.',
    iconName: 'Sun'
  },
  {
    id: 'satellite-data',
    title: 'Satellite Earth Observation Data',
    category: 'Satellite',
    shortSummary: 'Remote sensing data captured by spaceborne optical and thermal sensors.',
    whatItMeans: 'Earth Observation satellites orbit hundreds of kilometers above Earth, capturing multi-spectral radiation across visible, infrared, and thermal bands.',
    whyUrbanHeatUsesIt: 'Provides uniform, objective spatial coverage across all 24 wards of Greater Mumbai without requiring physical installation of thousands of ground sensors.',
    howItRelatesToProject: 'Combines Landsat-8/9 thermal observations (for LST) and Sentinel-2 MSI optical bands (for NDVI vegetation and NDBI concrete density).',
    iconName: 'Satellite'
  },
  {
    id: 'weather-data',
    title: 'Weather Data & Stations',
    category: 'Atmospheric',
    shortSummary: 'Surface weather station measurements recorded hourly.',
    whatItMeans: 'Standard meteorological data collected by ground weather stations (e.g. Santacruz Observatory, Colaba IMD station) measuring air temp, humidity, pressure, and wind speed.',
    whyUrbanHeatUsesIt: 'Tracks short-term atmospheric weather fluctuations and coastal sea breezes across Mumbai.',
    howItRelatesToProject: 'Proxied live via FastAPI REST endpoints connected to Open-Meteo surface weather services.',
    iconName: 'CloudCheck'
  },
  {
    id: 'historical-climate-data',
    title: 'Historical Climate Data & Timelines',
    category: 'Atmospheric',
    shortSummary: 'Multi-day and multi-year records used to evaluate thermal anomalies.',
    whatItMeans: 'Time-series records comparing current weather parameters against seasonal baseline averages across past weeks, months, or years.',
    whyUrbanHeatUsesIt: 'Helps municipal authorities distinguish routine summer heat from prolonged heatwave conditions.',
    howItRelatesToProject: 'Visualized in the 30-day thermal timeline chart comparing daily air temperature curves against satellite skin temperature points.',
    iconName: 'Calendar'
  },
  {
    id: 'vegetation-ndvi',
    title: 'Vegetation Index (NDVI)',
    category: 'Satellite',
    shortSummary: 'Normalized Difference Vegetation Index measuring green canopy density.',
    whatItMeans: 'NDVI is a satellite index ranging from -1.0 to +1.0 calculated from near-infrared and red light reflectance. Healthy green leaves absorb red light and strongly reflect near-infrared radiation.',
    whyUrbanHeatUsesIt: 'Trees and urban parks cool cities through shading and evapotranspiration (natural water evaporation from leaf stomata). High NDVI indicates a natural thermal buffer.',
    howItRelatesToProject: 'Computed per ward from Sentinel-2 imagery; wards with low NDVI scores receive higher heat risk weightings.',
    iconName: 'Trees'
  },
  {
    id: 'built-up-ndbi',
    title: 'Built-Up Index (NDBI)',
    category: 'Satellite',
    shortSummary: 'Normalized Difference Built-up Index measuring concrete & roof density.',
    whatItMeans: 'NDBI isolates impervious urban surfaces (buildings, pavement, industrial roofs) using shortwave infrared and near-infrared satellite bands.',
    whyUrbanHeatUsesIt: 'Concrete and metal roofs absorb intense solar radiation. High NDBI values correlate directly with severe localized heat trapping.',
    howItRelatesToProject: 'Quantifies concrete density for each Mumbai BMC ward as a core factor in the Baseline Heat Risk Index.',
    iconName: 'Building'
  },
  {
    id: 'geospatial-data',
    title: 'Geospatial GIS Boundaries',
    category: 'Geospatial',
    shortSummary: 'Geographically referenced polygon boundaries representing municipal wards.',
    whatItMeans: 'Digital GIS data containing precise longitude/latitude coordinates for administrative borders, coastline boundaries, and land contours.',
    whyUrbanHeatUsesIt: 'Ensures spatial insights align directly with Mumbai\'s 24 administrative MCGM / BMC ward divisions for policy decision-making.',
    howItRelatesToProject: 'Rendered as interactive vector choropleth polygons on MapLibre GL JS basemaps.',
    iconName: 'MapPin'
  },
  {
    id: 'heat-map-choropleth',
    title: 'Interactive Choropleth Heat Map',
    category: 'Geospatial',
    shortSummary: 'Color-coded spatial map visualising risk disparities across city wards.',
    whatItMeans: 'A thematic map where geographical areas are shaded or patterned in proportion to a statistical variable (such as Heat Risk, LST, or Vegetation).',
    whyUrbanHeatUsesIt: 'Allows citizens and urban planners to instantly identify high-risk thermal hotspots across Mumbai at a glance.',
    howItRelatesToProject: 'Interactive MapLibre vector map taking 70% of the screen viewport with 5 switchable thematic layers.',
    iconName: 'Layers'
  },
  {
    id: 'heat-risk-hvi',
    title: 'Baseline Heat Risk Index (HVI)',
    category: 'Risk & ML',
    shortSummary: 'Transparent 0–100 composite score weighting exposure, built-up density & greenery.',
    whatItMeans: 'A formula-driven composite score combining satellite surface temperature (35%), built-up concrete density (25%), vegetation deficit (20%), apparent heat index (10%), and population density (10%).',
    whyUrbanHeatUsesIt: 'Provides an explainable, science-backed risk metric without relying on opaque black-box models or synthetic training data.',
    howItRelatesToProject: 'Categorises each Mumbai ward into Low (<30), Moderate (30-50), High (50-75), or Extreme (>=75) risk tiers.',
    iconName: 'AlertTriangle'
  },
  {
    id: 'microclimate-clustering',
    title: 'Unsupervised Microclimate Clustering',
    category: 'Risk & ML',
    shortSummary: 'K-Means data science algorithm grouping wards into physical microclimate archetypes.',
    whatItMeans: 'Unsupervised Machine Learning algorithm that clusters wards sharing similar physical characteristics (LST, NDVI, NDBI, proximity to coast) without human bias.',
    whyUrbanHeatUsesIt: 'Identifies distinct structural microclimate zones: 1) Concrete Thermal Hotspots, 2) Vegetated Buffers, and 3) Coastal Moderate Zones.',
    howItRelatesToProject: 'Executed via scikit-learn models to assign cluster badges to all 24 wards.',
    iconName: 'Cpu'
  }
];

export const METRIC_TOOLTIPS: Record<string, MetricQuickTooltip> = {
  hvi: {
    title: 'Baseline Heat Risk Index (HVI)',
    shortDef: 'Transparent composite risk score (0–100) aggregating satellite LST, concrete density, vegetation deficit, humidity, and population density.',
    updateFrequency: 'Updated per dataset release',
    sourceName: 'UrbanHeat Weighted Algorithm v1.0',
    scienceTip: 'A higher score indicates greater combined thermal exposure and vulnerability.'
  },
  lst: {
    title: 'Land Surface Temperature (LST)',
    shortDef: 'Radiative skin temperature of ground surfaces (asphalt, concrete, foliage) measured from satellite thermal sensors.',
    updateFrequency: 'Periodic (16-day Landsat revisit cycle)',
    sourceName: 'USGS Landsat-9 TIRS Thermal Sensor',
    scienceTip: 'LST skin temp is NOT 2m air temp! Surface skin can be 5°C–12°C hotter than ambient air on sunny afternoons.'
  },
  ndvi: {
    title: 'Vegetation Canopy Index (NDVI)',
    shortDef: 'Measures green vegetation and tree canopy density from satellite optical bands.',
    updateFrequency: 'Periodic (5-day Sentinel-2 cycle)',
    sourceName: 'Sentinel-2 MSI Optical Bands',
    scienceTip: 'Trees cool cities via shade & evapotranspiration. High NDVI indicates a natural thermal buffer.'
  },
  ndbi: {
    title: 'Built-Up Concrete Index (NDBI)',
    shortDef: 'Measures concrete, pavement, asphalt, and impervious building surface density.',
    updateFrequency: 'Periodic (5-day Sentinel-2 cycle)',
    sourceName: 'Sentinel-2 SWIR/NIR Spectral Bands',
    scienceTip: 'Concrete & metal absorb shortwave solar energy and trap heat into the evening.'
  },
  apparent_temp: {
    title: 'Apparent Temp / Heat Index',
    shortDef: 'Human-perceived temperature combining air temperature and atmospheric humidity.',
    updateFrequency: 'Hourly (Live)',
    sourceName: 'Open-Meteo Weather Proxy Service',
    scienceTip: 'High humidity impairs sweat evaporation, making 34°C feel like 40°C in Mumbai.'
  },
  air_temp: {
    title: 'Ambient Air Temperature',
    shortDef: 'Kinetic air temperature at 2m height above ground measured by weather station sensors.',
    updateFrequency: 'Hourly (Live)',
    sourceName: 'Open-Meteo Weather API',
    scienceTip: 'Represents general atmospheric comfort at human breathing height.'
  }
};
