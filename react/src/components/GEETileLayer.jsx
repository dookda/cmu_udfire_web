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
  const tileUrlRef = useRef(tileUrl);
  const opacityRef = useRef(opacity);
  const isAddingLayerRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // Update refs when props change
  useEffect(() => {
    tileUrlRef.current = tileUrl;
    opacityRef.current = opacity;
  }, [tileUrl, opacity]);

  useEffect(() => {
    if (!map || !tileUrl) return;

    const mapInstance = map.getMap();
    const sourceId = sourceIdRef.current;
    const layerId = layerIdRef.current;

    // Function to safely add layer to map
    const addLayer = () => {
      // Prevent multiple simultaneous adds
      if (isAddingLayerRef.current) return;
      isAddingLayerRef.current = true;

      try {
        // Wait for style to be fully loaded
        if (!mapInstance.isStyleLoaded()) {
          isAddingLayerRef.current = false;
          return;
        }

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
          tiles: [tileUrlRef.current],
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
              'raster-opacity': opacityRef.current
            }
          },
          beforeId
        );

        console.log('GEE layer added successfully:', layerId);
        hasInitializedRef.current = true;
      } catch (error) {
        console.error('Error adding GEE layer:', error);
      } finally {
        isAddingLayerRef.current = false;
      }
    };

    // Handler for style data changes
    const handleStyleData = (e) => {
      // Only re-add layer when style is fully loaded after a change
      // Ignore if we haven't initialized yet (initial load handles it)
      if (e.dataType === 'style' && hasInitializedRef.current) {
        // Check if our layer is missing (indicates basemap change)
        const layerMissing = !mapInstance.getLayer(layerId);

        if (layerMissing) {
          setTimeout(() => {
            if (mapInstance.isStyleLoaded() && !mapInstance.getLayer(layerId)) {
              addLayer();
            }
          }, 100);
        }
      }
    };

    // Initial load
    if (mapInstance.isStyleLoaded()) {
      addLayer();
    } else {
      // Wait for initial load
      mapInstance.once('load', addLayer);
    }

    // Listen for style changes (basemap switching)
    mapInstance.on('styledata', handleStyleData);

    // Cleanup
    return () => {
      mapInstance.off('styledata', handleStyleData);

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
        console.warn('GEE layer cleanup warning:', error);
      }
    };
  }, [map, tileUrl, opacity, beforeId]);

  return null;
}
