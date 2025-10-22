import { useEffect, useRef } from 'react';
import { useMap } from 'react-map-gl/maplibre';

/**
 * Component to add Google Earth Engine tile layer to MapLibre map
 * Persists across basemap style changes with robust event handling
 */
export default function GEETileLayer({ tileUrl, opacity = 0.7, beforeId }) {
  const { current: map } = useMap();
  const layerIdRef = useRef(`gee-layer-${Date.now()}`);
  const sourceIdRef = useRef(`gee-source-${Date.now()}`);
  const styleLoadHandlerRef = useRef(null);

  useEffect(() => {
    if (!map || !tileUrl) return;

    const mapInstance = map.getMap();
    const sourceId = sourceIdRef.current;
    const layerId = layerIdRef.current;

    // Function to safely add layer to map
    const addLayer = () => {
      // Wait for style to be fully loaded
      if (!mapInstance.isStyleLoaded()) {
        return;
      }

      // Remove existing layer and source if they exist
      try {
        if (mapInstance.getLayer(layerId)) {
          mapInstance.removeLayer(layerId);
        }
        if (mapInstance.getSource(sourceId)) {
          mapInstance.removeSource(sourceId);
        }
      } catch (error) {
        console.warn('Error removing existing GEE layer:', error);
      }

      // Add new source
      try {
        mapInstance.addSource(sourceId, {
          type: 'raster',
          tiles: [tileUrl],
          tileSize: 256,
          attribution: 'Google Earth Engine'
        });

        // Add new layer on top of basemap
        mapInstance.addLayer(
          {
            id: layerId,
            type: 'raster',
            source: sourceId,
            paint: {
              'raster-opacity': opacity
            }
          },
          beforeId
        );

        // Ensure this layer is always on top by moving it if needed
        if (!beforeId) {
          const layers = mapInstance.getStyle()?.layers;
          if (layers && layers.length > 0) {
            mapInstance.moveLayer(layerId);
          }
        }
      } catch (error) {
        console.error('Error adding GEE layer:', error);
      }
    };

    // Style load handler that persists across basemap changes
    const handleStyleLoad = () => {
      // Small delay to ensure style is fully processed
      setTimeout(() => {
        addLayer();
      }, 100);
    };

    // Store handler in ref for cleanup
    styleLoadHandlerRef.current = handleStyleLoad;

    // Initial load
    if (mapInstance.isStyleLoaded()) {
      addLayer();
    }

    // Listen for style changes (basemap switching)
    mapInstance.on('style.load', handleStyleLoad);

    // Cleanup
    return () => {
      if (styleLoadHandlerRef.current) {
        mapInstance.off('style.load', styleLoadHandlerRef.current);
      }

      // Clean removal of layer and source
      try {
        if (mapInstance.getLayer(layerId)) {
          mapInstance.removeLayer(layerId);
        }
        if (mapInstance.getSource(sourceId)) {
          mapInstance.removeSource(sourceId);
        }
      } catch (error) {
        // Map may already be destroyed
        console.warn('Cleanup warning:', error);
      }
    };
  }, [map, tileUrl, opacity, beforeId]);

  return null;
}
