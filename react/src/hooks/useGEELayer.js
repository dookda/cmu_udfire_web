import { useState, useEffect } from 'react';
import { geeService } from '../services/geeService';

/**
 * Custom hook to fetch and manage Google Earth Engine layers
 * @param {string} layerType - Type of layer (ndmi, ndvi, ndwi, burn-scar, biomass, flood)
 * @param {object} params - Parameters for the layer (area, dates, etc.)
 */
export function useGEELayer(layerType, params) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [layerData, setLayerData] = useState(null);

  useEffect(() => {
    if (!layerType || !params?.area) {
      return;
    }

    const fetchLayer = async () => {
      setLoading(true);
      setError(null);

      try {
        let result;

        switch (layerType) {
          case 'ndmi':
            result = await geeService.getNDMILayer(
              params.area,
              params.endDate,
              params.days
            );
            break;

          case 'ndvi':
            result = await geeService.getNDVILayer(
              params.area,
              params.endDate,
              params.days
            );
            break;

          case 'ndwi':
            result = await geeService.getNDWILayer(
              params.area,
              params.endDate,
              params.days
            );
            break;

          case 'burn-scar':
            result = await geeService.getBurnScarLayer(
              params.area,
              params.startDate,
              params.endDate,
              params.cloudCover
            );
            break;

          case 'biomass':
            result = await geeService.getBiomassLayer(
              params.area,
              params.endDate,
              params.days
            );
            break;

          case 'flood':
            result = await geeService.getFloodLayer(
              params.area,
              params.beforeDate,
              params.afterDate
            );
            break;

          default:
            throw new Error(`Unknown layer type: ${layerType}`);
        }

        setLayerData(result.data);
      } catch (err) {
        console.error('Error fetching GEE layer:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLayer();
  }, [layerType, JSON.stringify(params)]);

  return { loading, error, layerData };
}

/**
 * Hook to manage multiple GEE layers with a layer switcher
 */
export function useGEELayers(initialLayer, params) {
  const [activeLayer, setActiveLayer] = useState(initialLayer);
  const { loading, error, layerData } = useGEELayer(activeLayer, params);

  const switchLayer = (newLayer) => {
    setActiveLayer(newLayer);
  };

  return {
    activeLayer,
    switchLayer,
    loading,
    error,
    layerData
  };
}
