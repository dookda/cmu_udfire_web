import { useState, useEffect } from 'react';
import { useGEELayers } from '../hooks/useGEELayer';
import GEETileLayer from './GEETileLayer';

/**
 * GEE Layer Control component
 * Provides UI controls to switch between different GEE layers
 */
export default function GEELayerControl({
  studyArea = 'ud',
  endDate,
  layerTypes = ['ndmi', 'ndvi', 'ndwi'],
  onLayerChange
}) {
  const [activeLayerType, setActiveLayerType] = useState(layerTypes[0]);

  const { loading, error, layerData } = useGEELayers(activeLayerType, {
    area: studyArea,
    endDate: endDate,
    days: 30
  });

  const handleLayerChange = (newLayer) => {
    setActiveLayerType(newLayer);
    if (onLayerChange) {
      onLayerChange(newLayer);
    }
  };

  const getLayerLabel = (layerType) => {
    const labels = {
      'ndmi': 'NDMI (Drought)',
      'ndvi': 'NDVI (Vegetation)',
      'ndwi': 'NDWI (Water)',
      'burn-scar': 'Burn Scars',
      'biomass': 'Biomass'
    };
    return labels[layerType] || layerType.toUpperCase();
  };

  return (
    <div className="gee-layer-control">
      {/* Layer Selector */}
      <div className="flex flex-col gap-2 bg-base-100/70 backdrop-blur-md p-3 rounded-lg shadow-lg border border-base-content/10">
        <div className="text-xs font-bold mb-1">Satellite Layers</div>

        {layerTypes.map((layerType) => (
          <label key={layerType} className="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded text-xs">
            <input
              type="radio"
              name="gee-layer"
              className="radio radio-xs radio-primary"
              checked={activeLayerType === layerType}
              onChange={() => handleLayerChange(layerType)}
            />
            <span>{getLayerLabel(layerType)}</span>
          </label>
        ))}

        {loading && (
          <div className="flex items-center gap-2 mt-2">
            <span className="loading loading-spinner loading-xs"></span>
            <span className="text-xs">Loading layer...</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error py-2 mt-2">
            <span className="text-xs">{error}</span>
          </div>
        )}

        {layerData && layerData.stats && (
          <div className="mt-2 text-xs">
            <div className="font-bold mb-1">Statistics:</div>
            <div className="space-y-1">
              {Object.entries(layerData.stats).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="opacity-70">{key}:</span>
                  <span className="font-mono">{typeof value === 'number' ? value.toFixed(3) : value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Render GEE Tile Layer */}
      {layerData && layerData.tile_url && (
        <GEETileLayer
          tileUrl={layerData.tile_url}
          opacity={0.7}
        />
      )}
    </div>
  );
}
