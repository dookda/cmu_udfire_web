import { useEffect, useRef } from 'react';
import { useMap } from 'react-map-gl/maplibre';

/**
 * Component to add Google Earth Engine tile layer to MapLibre map
 * Persists across basemap style changes
 */
export default function GEETileLayer({ tileUrl, opacity = 0.7, beforeId }) {
  const { current: map } = useMap();
  const layerIdRef = useRef(`gee-layer-${Date.now()}`);
  const sourceIdRef = useRef(`gee-source-${Date.now()}`);

  useEffect(() => {
    if (!map || !tileUrl) return;

    const mapInstance = map.getMap();
    const sourceId = sourceIdRef.current;
    const layerId = layerIdRef.current;

    // Function to add layer to map
    const addLayer = () => {
      // Remove existing layer and source if they exist
      if (mapInstance.getLayer(layerId)) {
        mapInstance.removeLayer(layerId);
      }
      if (mapInstance.getSource(sourceId)) {
        mapInstance.removeSource(sourceId);
      }

      // Add new source
      mapInstance.addSource(sourceId, {
        type: 'raster',
        tiles: [tileUrl],
        tileSize: 256,
        attribution: 'Google Earth Engine'
      });

      // Add new layer on top of basemap (as the topmost layer)
      // If beforeId is not specified, it will be added on top
      mapInstance.addLayer(
        {
          id: layerId,
          type: 'raster',
          source: sourceId,
          paint: {
            'raster-opacity': opacity
          }
        },
        beforeId // undefined by default, which means add on top
      );

      // Ensure this layer is always on top by moving it if needed
      if (!beforeId) {
        const layers = mapInstance.getStyle().layers;
        if (layers && layers.length > 0) {
          // Move GEE layer to be the last layer (on top)
          mapInstance.moveLayer(layerId);
        }
      }
    };

    // Add layer when style is loaded
    if (mapInstance.isStyleLoaded()) {
      addLayer();
    } else {
      mapInstance.once('style.load', addLayer);
    }

    // Re-add layer when basemap style changes (style.load event)
    // This ensures GEE layer persists on top when switching basemaps
    const handleStyleChange = () => {
      if (mapInstance.isStyleLoaded()) {
        addLayer();
      }
    };

    mapInstance.on('style.load', handleStyleChange);

    // Cleanup
    return () => {
      mapInstance.off('style.load', handleStyleChange);
      if (mapInstance.getLayer(layerId)) {
        mapInstance.removeLayer(layerId);
      }
      if (mapInstance.getSource(sourceId)) {
        mapInstance.removeSource(sourceId);
      }
    };
  }, [map, tileUrl, opacity, beforeId]);

  return null;
}
