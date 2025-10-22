import { useEffect, useRef } from 'react';
import { useMap } from 'react-map-gl/maplibre';

/**
 * Component to add Google Earth Engine tile layer to MapLibre map
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

    // Wait for map to be loaded
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

      // Add new layer
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
    };

    if (mapInstance.isStyleLoaded()) {
      addLayer();
    } else {
      mapInstance.once('style.load', addLayer);
    }

    // Cleanup
    return () => {
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
