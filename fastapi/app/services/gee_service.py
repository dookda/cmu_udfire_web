import ee
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import json
import os
from google.oauth2 import service_account

class GEEService:
    """Google Earth Engine service for processing satellite imagery"""

    # Study area feature collections
    STUDY_AREAS = {
        "ud": "projects/ee-sakda-451407/assets/fire/paktab",
        "mt": "projects/ee-sakda-451407/assets/fire/meatha_n",
        "ky": "projects/ee-sakda-451407/assets/fire/khunyoam",
        "vs": "projects/ee-sakda-451407/assets/fire/winagsa",
        "ms": "projects/ee-sakda-451407/assets/fire/measariang",
        "st": "projects/ee-sakda-451407/assets/fire/soubtea",
        "msr": "projects/ee-sakda-451407/assets/fire/mea_sa_riang",
        "fbound": "projects/ee-sakda-451407/assets/fire/forest_bound_sgpart"
    }

    # Color palettes
    PALETTES = {
        "ndvi": ['d7191c', 'fdae61', 'ffffbf', 'a6d96a', '1a9641'],
        "ndmi": ['e66101', 'fdb863', 'f7f7f7', 'b2abd2', '5e3c99'],
        "ndwi": ['d01c8b', 'f1b6da', 'f7f7f7', 'b8e186', '4dac26'],
        "burn": ['4f5bd5', 'd62976', 'feda75', 'feda75'],
        "biomass": ['5e3c99', 'b2abd2', 'f7f7f7', 'fdb863', 'e66101'],
        "flood": ['0000ff']  # Blue for flooded areas
    }

    def __init__(self):
        """Initialize Earth Engine with service account"""
        try:
            # Get service account file path from environment variable
            service_account_file = os.getenv('GEE_SERVICE_ACCOUNT', '/app/sakdagee-aac5df75dc7f.json')

            if os.path.exists(service_account_file):
                # Use service account authentication
                credentials = service_account.Credentials.from_service_account_file(
                    service_account_file,
                    scopes=['https://www.googleapis.com/auth/earthengine']
                )
                ee.Initialize(credentials)
                print(f"✓ Earth Engine initialized with service account: {service_account_file}")
            else:
                # Fall back to default authentication
                ee.Initialize()
                print("✓ Earth Engine initialized with default credentials")

        except Exception as e:
            raise Exception(f"Failed to initialize Earth Engine: {str(e)}")

    def get_study_area(self, area_code: str) -> ee.FeatureCollection:
        """Get study area feature collection"""
        if area_code not in self.STUDY_AREAS:
            raise ValueError(f"Invalid area code: {area_code}")
        return ee.FeatureCollection(self.STUDY_AREAS[area_code])

    def compute_ndvi(self, image: ee.Image, area: ee.FeatureCollection) -> ee.Image:
        """Compute NDVI from Sentinel-2 image"""
        ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI').clip(area)
        return image.addBands(ndvi)

    def compute_ndmi(self, image: ee.Image, area: ee.FeatureCollection) -> ee.Image:
        """Compute NDMI (drought index) from Sentinel-2 image"""
        ndmi = image.normalizedDifference(['B8', 'B11']).rename('NDMI').clip(area)
        return image.addBands(ndmi)

    def compute_ndwi(self, image: ee.Image, area: ee.FeatureCollection) -> ee.Image:
        """Compute NDWI (water index) from Sentinel-2 image"""
        ndwi = image.normalizedDifference(['B3', 'B8']).rename('NDWI').clip(area)
        return image.addBands(ndwi)

    def get_ndmi_layer(
        self,
        area_code: str,
        end_date: str,
        days_composite: int = 30
    ) -> Dict:
        """
        Get NDMI drought index layer as map tiles

        Args:
            area_code: Study area code (ud, mt, ky, vs, ms)
            end_date: End date in YYYY-MM-DD format
            days_composite: Number of days for composite (default 30)

        Returns:
            Dictionary with tile URL and visualization parameters
        """
        area = self.get_study_area(area_code)

        # Calculate start date
        end = ee.Date(end_date)
        start = end.advance(-days_composite, 'day')

        # Get Sentinel-2 data
        dataset = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
            .filterDate(start, end) \
            .filterBounds(area)

        # Compute NDMI
        ndmi_collection = dataset.map(lambda img: self.compute_ndmi(img, area))
        ndmi_median = ndmi_collection.select('NDMI').median()

        # Calculate statistics for visualization
        stats = ndmi_median.reduceRegion(
            reducer=ee.Reducer.minMax(),
            geometry=area,
            scale=500,
            bestEffort=True
        ).getInfo()

        vis_params = {
            'min': stats.get('NDMI_min', -0.5),
            'max': stats.get('NDMI_max', 0.5),
            'palette': self.PALETTES['ndmi']
        }

        # Get map ID
        map_id = ndmi_median.getMapId(vis_params)

        # Get bounds
        bounds = area.geometry().bounds().getInfo()['coordinates'][0]

        return {
            'tile_url': map_id['tile_fetcher'].url_format,
            'vis_params': vis_params,
            'bounds': bounds,
            'stats': stats
        }

    def get_burn_scar_layer(
        self,
        area_code: str,
        start_date: str,
        end_date: str,
        cloud_cover: int = 30
    ) -> Dict:
        """
        Get burn scar detection layer

        Args:
            area_code: Study area code
            start_date: Start date in YYYY-MM-DD format
            end_date: End date in YYYY-MM-DD format
            cloud_cover: Maximum cloud cover percentage

        Returns:
            Dictionary with tile URLs for NBR and burn scars
        """
        area = self.get_study_area(area_code)

        # Get Sentinel-2 data
        s2_collection = ee.ImageCollection('COPERNICUS/S2_SR') \
            .filterDate(start_date, end_date) \
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', cloud_cover)) \
            .filterBounds(area)

        # Prepare images (clip and scale)
        def prepare_image(img):
            return img.clip(area).divide(10000)

        s2_median = s2_collection.map(prepare_image).median()

        # Calculate NBR (Normalized Burn Ratio)
        nbr = s2_median.normalizedDifference(['B8A', 'B12']).rename('NBR')

        # Calculate NIRBI for burn scar detection
        band12 = s2_median.select('B12')
        band11 = s2_median.select('B11')

        nirbi = s2_median.expression(
            '10 * B12 - 9.8 * B11 + 2',
            {'B12': band12, 'B11': band11}
        ).rename('NIRBI')

        # Detect burn scars (threshold)
        threshold = 0.8
        burn_scars = nirbi.lt(threshold)

        # Visualization parameters
        nbr_vis = {
            'min': -0.3,
            'max': 0.5,
            'palette': self.PALETTES['burn']
        }

        burn_scar_vis = {
            'palette': ['white', 'red'],
            'min': 0,
            'max': 1
        }

        # Get map IDs
        nbr_map_id = nbr.getMapId(nbr_vis)
        burn_scar_map_id = burn_scars.getMapId(burn_scar_vis)

        # Get bounds
        bounds = area.geometry().bounds().getInfo()['coordinates'][0]

        return {
            'nbr': {
                'tile_url': nbr_map_id['tile_fetcher'].url_format,
                'vis_params': nbr_vis
            },
            'burn_scars': {
                'tile_url': burn_scar_map_id['tile_fetcher'].url_format,
                'vis_params': burn_scar_vis
            },
            'bounds': bounds
        }

    def get_biomass_layer(
        self,
        area_code: str,
        end_date: str,
        days_composite: int = 30
    ) -> Dict:
        """
        Get 3PGs biomass estimation layer

        Args:
            area_code: Study area code
            end_date: End date in YYYY-MM-DD format
            days_composite: Number of days for composite

        Returns:
            Dictionary with tile URLs for NDVI and biomass layers
        """
        area = self.get_study_area(area_code)

        # Calculate dates
        end = ee.Date(end_date)
        start = end.advance(-days_composite, 'day')

        # MODIS data processing functions
        def reproject_image(img):
            return img.reproject(crs="EPSG:32647", scale=500)

        def compute_ndvi_modis(img):
            ndvi = img.normalizedDifference(['sur_refl_b02', 'sur_refl_b01']).rename('NDVI')
            return img.addBands(ndvi)

        def compute_biomass(img):
            # Get solar radiation data
            solar_rad = ee.ImageCollection('MODIS/062/MCD18A1') \
                .filterDate('2023-11-01', '2024-03-30') \
                .filterBounds(area) \
                .select('GMT_0900_DSR') \
                .median()

            # FPAR calculation
            fpar = img.select('NDVI').multiply(1.5).add(0.1).rename('FPAR')

            # DSR 24hr
            dsr24hr = solar_rad.select('GMT_0900_DSR') \
                .multiply(18000).divide(1000000).rename('DSR24hr')

            # PAR (45% of DSR)
            par = dsr24hr.multiply(0.45).rename('PAR')

            # APAR
            apar = fpar.multiply(par).rename('APAR')

            # GPP
            gpp = apar.multiply(1.8).rename('GPP')

            # NPP (45% of GPP)
            npp = gpp.multiply(0.45).rename('NPP')

            # Biomass (carbon to biomass factor = 2.5)
            bm = npp.multiply(2.5).rename('BM')

            # Biomass TUM equation
            bmt = img.expression(
                '7.25923 * pow(NDVI, 3) - 13.419 * pow(NDVI, 2) + 6.4542 * NDVI - 0.2305',
                {'NDVI': img.select('NDVI')}
            ).rename('BMT')

            return img.addBands([fpar, dsr24hr, par, apar, gpp, npp, bm, bmt])

        # Get MODIS data
        modis_data = ee.ImageCollection('MODIS/061/MOD09GA') \
            .filterDate(start, end) \
            .filterBounds(area) \
            .map(reproject_image) \
            .map(compute_ndvi_modis) \
            .map(compute_biomass)

        # Get median values
        ndvi_median = modis_data.select('NDVI').median().clip(area)
        bm_median = modis_data.select('BM').median().clip(area)
        bmt_median = modis_data.select('BMT').median().clip(area)

        # Calculate statistics
        ndvi_stats = ndvi_median.reduceRegion(
            reducer=ee.Reducer.minMax(),
            geometry=area,
            scale=500,
            bestEffort=True
        ).getInfo()

        bm_stats = bm_median.reduceRegion(
            reducer=ee.Reducer.minMax(),
            geometry=area,
            scale=500,
            bestEffort=True
        ).getInfo()

        bmt_stats = bmt_median.reduceRegion(
            reducer=ee.Reducer.minMax(),
            geometry=area,
            scale=500,
            bestEffort=True
        ).getInfo()

        # Visualization parameters
        ndvi_vis = {
            'min': ndvi_stats.get('NDVI_min', 0),
            'max': ndvi_stats.get('NDVI_max', 1),
            'palette': self.PALETTES['ndvi']
        }

        bm_vis = {
            'min': bm_stats.get('BM_min', 0),
            'max': bm_stats.get('BM_max', 10),
            'palette': self.PALETTES['biomass']
        }

        bmt_vis = {
            'min': bmt_stats.get('BMT_min', 0),
            'max': bmt_stats.get('BMT_max', 10),
            'palette': self.PALETTES['biomass']
        }

        # Get map IDs
        ndvi_map_id = ndvi_median.getMapId(ndvi_vis)
        bm_map_id = bm_median.getMapId(bm_vis)
        bmt_map_id = bmt_median.getMapId(bmt_vis)

        # Get bounds
        bounds = area.geometry().bounds().getInfo()['coordinates'][0]

        return {
            'ndvi': {
                'tile_url': ndvi_map_id['tile_fetcher'].url_format,
                'vis_params': ndvi_vis,
                'stats': ndvi_stats
            },
            'biomass_3pgs': {
                'tile_url': bm_map_id['tile_fetcher'].url_format,
                'vis_params': bm_vis,
                'stats': bm_stats
            },
            'biomass_equation': {
                'tile_url': bmt_map_id['tile_fetcher'].url_format,
                'vis_params': bmt_vis,
                'stats': bmt_stats
            },
            'bounds': bounds
        }

    def get_ndvi_layer(
        self,
        area_code: str,
        end_date: str,
        days_composite: int = 30
    ) -> Dict:
        """Get NDVI layer"""
        area = self.get_study_area(area_code)

        end = ee.Date(end_date)
        start = end.advance(-days_composite, 'day')

        dataset = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
            .filterDate(start, end) \
            .filterBounds(area)

        ndvi_collection = dataset.map(lambda img: self.compute_ndvi(img, area))
        ndvi_median = ndvi_collection.select('NDVI').median()

        stats = ndvi_median.reduceRegion(
            reducer=ee.Reducer.minMax(),
            geometry=area,
            scale=500,
            bestEffort=True
        ).getInfo()

        vis_params = {
            'min': stats.get('NDVI_min', 0),
            'max': stats.get('NDVI_max', 1),
            'palette': self.PALETTES['ndvi']
        }

        map_id = ndvi_median.getMapId(vis_params)
        bounds = area.geometry().bounds().getInfo()['coordinates'][0]

        return {
            'tile_url': map_id['tile_fetcher'].url_format,
            'vis_params': vis_params,
            'bounds': bounds,
            'stats': stats
        }

    def get_ndwi_layer(
        self,
        area_code: str,
        end_date: str,
        days_composite: int = 30
    ) -> Dict:
        """Get NDWI (water index) layer"""
        area = self.get_study_area(area_code)

        end = ee.Date(end_date)
        start = end.advance(-days_composite, 'day')

        dataset = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
            .filterDate(start, end) \
            .filterBounds(area)

        ndwi_collection = dataset.map(lambda img: self.compute_ndwi(img, area))
        ndwi_median = ndwi_collection.select('NDWI').median()

        stats = ndwi_median.reduceRegion(
            reducer=ee.Reducer.minMax(),
            geometry=area,
            scale=500,
            bestEffort=True
        ).getInfo()

        vis_params = {
            'min': stats.get('NDWI_min', -0.5),
            'max': stats.get('NDWI_max', 0.5),
            'palette': self.PALETTES['ndwi']
        }

        map_id = ndwi_median.getMapId(vis_params)
        bounds = area.geometry().bounds().getInfo()['coordinates'][0]

        return {
            'tile_url': map_id['tile_fetcher'].url_format,
            'vis_params': vis_params,
            'bounds': bounds,
            'stats': stats
        }

    def get_flood_layer(
        self,
        area_code: str,
        before_date: str,
        after_date: str
    ) -> Dict:
        """
        Get flood detection layer using Sentinel-1 SAR data

        Args:
            area_code: Study area code
            before_date: Date before flood event (YYYY-MM-DD)
            after_date: Date after flood event (YYYY-MM-DD)

        Returns:
            Dictionary with tile URL for flooded areas
        """
        area = self.get_study_area(area_code)

        # Sentinel-1 GRD collection
        s1_collection = ee.ImageCollection('COPERNICUS/S1_GRD') \
            .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH')) \
            .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING')) \
            .filter(ee.Filter.eq('instrumentMode', 'IW')) \
            .filterBounds(area)

        # Before flood image - use 30-day window for better data availability
        before_end = ee.Date(before_date)
        before_start = before_end.advance(-30, 'day')
        before_collection = s1_collection.filterDate(before_start, before_end)
        before_image = before_collection.select('VH').mean().clip(area)

        # After flood image - use 30-day window for better data availability
        after_start = ee.Date(after_date)
        after_end = after_start.advance(30, 'day')
        after_collection = s1_collection.filterDate(after_start, after_end)
        after_image = after_collection.select('VH').mean().clip(area)

        # Calculate difference
        difference = after_image.subtract(before_image)

        # Threshold for flood detection (-5.5 dB from flood.js)
        flood_threshold = -5.5
        flooded = difference.lt(flood_threshold)

        # Mask permanent water bodies using JRC Global Surface Water
        gsw = ee.Image('JRC/GSW1_4/GlobalSurfaceWater')
        permanent_water = gsw.select('occurrence').gt(80)
        flooded_masked = flooded.where(permanent_water, 0)

        # Mask steep slopes (< 5 degrees from flood.js)
        srtm = ee.Image('USGS/SRTMGL1_003')
        slope = ee.Terrain.slope(srtm)
        flooded_final = flooded_masked.updateMask(slope.lt(5))

        # Visualization parameters - blue for flooded areas
        vis_params = {
            'min': 0,
            'max': 1,
            'palette': self.PALETTES['flood']
        }

        # Calculate flooded area in km²
        area_image = flooded_final.multiply(ee.Image.pixelArea())
        stats = area_image.reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=area,
            scale=10,
            maxPixels=1e13,
            bestEffort=True
        ).getInfo()

        flooded_area_m2 = stats.get('VH', 0)
        flooded_area_km2 = flooded_area_m2 / 1000000

        # Get map ID
        map_id = flooded_final.selfMask().getMapId(vis_params)

        # Get bounds
        bounds = area.geometry().bounds().getInfo()['coordinates'][0]

        return {
            'tile_url': map_id['tile_fetcher'].url_format,
            'vis_params': vis_params,
            'bounds': bounds,
            'flood_area': flooded_area_km2,
            'difference': flood_threshold,
            'confidence': 85  # High confidence for SAR-based detection
        }
