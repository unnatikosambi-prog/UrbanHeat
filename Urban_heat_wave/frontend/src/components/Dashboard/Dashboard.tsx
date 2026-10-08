import React, { useEffect, useState } from 'react';
import { Header } from '../Header';
import { MapView } from '../Map/MapView';
import { AnalyticsSidebar } from '../Sidebar/AnalyticsSidebar';
import { ScienceModal } from '../Educational/ScienceModal';
import { useRouter } from '../../router/RouterContext';
import {
  fetchWardGeoJSON,
  fetchWardMetrics,
  refreshLiveWardMetrics,
  fetchCurrentWeather,
  MUMBAI_DEFAULT_COORDS,
  WARD_CENTROIDS,
  DEMO_CITY_SUMMARY
} from '../../services/api';
import type { FeatureCollection } from 'geojson';
import type { MapLayerType, WardMetrics, CurrentWeather } from '../../types';
import { AlertCircle, Loader2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { navigate } = useRouter();
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(null);
  const [wardMetricsMap, setWardMetricsMap] = useState<Record<string, WardMetrics>>({});
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [isRefreshingLive, setIsRefreshingLive] = useState<boolean>(false);
  
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('hvi');
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [initialError, setInitialError] = useState<string | null>(null);

  // Educational Science Modal state
  const [isScienceOpen, setIsScienceOpen] = useState<boolean>(false);

  const handleRefreshLive = async () => {
    try {
      setIsRefreshingLive(true);
      const metrics = await refreshLiveWardMetrics();
      setWardMetricsMap(metrics);
    } catch (err) {
      console.warn('Live refresh error:', err);
    } finally {
      setIsRefreshingLive(false);
    }
  };

  // Load initial spatial datasets
  useEffect(() => {
    async function loadInitialData() {
      try {
        setInitialLoading(true);
        setInitialError(null);

        const [geoJson, metrics] = await Promise.all([
          fetchWardGeoJSON(),
          fetchWardMetrics()
        ]);

        setGeoJsonData(geoJson);
        setWardMetricsMap(metrics);
      } catch (err: any) {
        console.error('Initial Data Loading Error:', err);
        setInitialError(err.message || 'Failed to load UrbanHeat spatial datasets.');
      } finally {
        setInitialLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Fetch real atmospheric weather based on selected ward centroid or default Mumbai coordinates
  const loadWeather = async (lat: number, lon: number) => {
    try {
      setWeatherLoading(true);
      setWeatherError(null);
      const data = await fetchCurrentWeather(lat, lon);
      setWeather(data);
    } catch (err: any) {
      console.error('Weather Fetch Error:', err);
      setWeatherError('Weather data temporarily unavailable');
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Weather effect triggered on mount and when selected Ward changes
  useEffect(() => {
    if (selectedWardId && WARD_CENTROIDS[selectedWardId]) {
      const { lat, lon } = WARD_CENTROIDS[selectedWardId];
      loadWeather(lat, lon);
    } else {
      loadWeather(MUMBAI_DEFAULT_COORDS.lat, MUMBAI_DEFAULT_COORDS.lon);
    }
  }, [selectedWardId]);

  const wardNames = Object.values(wardMetricsMap).map(w => ({
    id: w.ward_id,
    name: w.ward_name,
    code: w.ward_code
  }));

  const selectedWard = selectedWardId ? wardMetricsMap[selectedWardId] || null : null;

  if (initialLoading) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 gap-3">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        <h2 className="text-sm font-semibold tracking-wider text-slate-300">
          Loading UrbanHeat Mumbai Spatial Intelligence...
        </h2>
      </div>
    );
  }

  if (initialError) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-6">
        <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-red-500/30 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-100">Unable to Initialize Platform</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{initialError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs rounded-lg transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 overflow-hidden select-none">
      {/* Top Glass Header */}
      <Header
        weather={weather}
        weatherLoading={weatherLoading}
        wardNames={wardNames}
        onSelectWard={(id) => setSelectedWardId(id)}
        selectedWardId={selectedWardId}
        onOpenScience={() => setIsScienceOpen(true)}
        onNavigateHome={() => navigate('/')}
        onRefreshLive={handleRefreshLive}
        isRefreshingLive={isRefreshingLive}
      />

      {/* Main Viewport: 70% Map / 30% Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Map Viewport (70% desktop width) */}
        <main className="flex-1 relative h-full">
          <MapView
            geoJsonData={geoJsonData}
            selectedWardId={selectedWardId}
            onSelectWard={(id) => setSelectedWardId(id)}
            activeLayer={activeLayer}
            onChangeLayer={(layer) => setActiveLayer(layer)}
          />
        </main>

        {/* Analytics Sidebar (30% desktop width) */}
        <AnalyticsSidebar
          selectedWard={selectedWard}
          summary={DEMO_CITY_SUMMARY}
          weather={weather}
          weatherLoading={weatherLoading}
          weatherError={weatherError}
          onRetryWeather={() => {
            if (selectedWardId && WARD_CENTROIDS[selectedWardId]) {
              const { lat, lon } = WARD_CENTROIDS[selectedWardId];
              loadWeather(lat, lon);
            } else {
              loadWeather(MUMBAI_DEFAULT_COORDS.lat, MUMBAI_DEFAULT_COORDS.lon);
            }
          }}
          onClearSelection={() => setSelectedWardId(null)}
          onSelectWardByName={(name) => {
            const match = Object.values(wardMetricsMap).find(w => w.ward_name.includes(name));
            if (match) setSelectedWardId(match.ward_id);
          }}
        />
      </div>

      {/* Educational Science Modal */}
      <ScienceModal
        isOpen={isScienceOpen}
        onClose={() => setIsScienceOpen(false)}
      />
    </div>
  );
};
