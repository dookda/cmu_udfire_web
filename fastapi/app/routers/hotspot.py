from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse, FileResponse
import os
import json
import httpx

router = APIRouter()

# Base path for geojson data (files are in fastapi root)
HPPREDICT_PATH = "/app"

@router.get("/hexagon-predictions")
async def get_hexagon_predictions():
    """
    Get hexagon forest predictions GeoJSON data
    """
    try:
        geojson_path = os.path.join(HPPREDICT_PATH, "hex_forest_pro_4326_predict.geojson")

        if not os.path.exists(geojson_path):
            raise HTTPException(status_code=404, detail="Hexagon predictions file not found")

        return FileResponse(
            geojson_path,
            media_type="application/json",
            headers={"Content-Disposition": "inline"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/firms-hotspots")
async def get_firms_hotspots(area: str = "SouthEast_Asia"):
    """
    Proxy endpoint to fetch FIRMS thermal anomalies
    """
    try:
        # FIRMS WFS GeoJSON endpoint for Southeast Asia (24 hours)
        firms_url = "https://firms.modaps.eosdis.nasa.gov/mapserver/wfs/SouthEast_Asia/7a16aa667fe01b181ffebcf83c022e34/?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAME=ms:fires_modis_24hrs&STARTINDEX=0&COUNT=1000&SRSNAME=urn:ogc:def:crs:EPSG::4326&BBOX=-90,-180,90,180,urn:ogc:def:crs:EPSG::4326&outputformat=geojson"

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(firms_url)

            if response.status_code != 200:
                # Fallback to MODIS API
                firms_fallback_url = "https://firms.modaps.eosdis.nasa.gov/api/country/json/7a16aa667fe01b181ffebcf83c022e34/MODIS_NRT/THA/1"
                fallback_response = await client.get(firms_fallback_url)

                if fallback_response.status_code == 200:
                    data = fallback_response.json()

                    # Convert to GeoJSON
                    geojson_data = {
                        "type": "FeatureCollection",
                        "features": [
                            {
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [float(hotspot["longitude"]), float(hotspot["latitude"])]
                                },
                                "properties": {
                                    "confidence": hotspot.get("confidence"),
                                    "bright_ti4": hotspot.get("bright_ti4"),
                                    "bright_ti5": hotspot.get("bright_ti5"),
                                    "scan": hotspot.get("scan"),
                                    "track": hotspot.get("track"),
                                    "acq_date": hotspot.get("acq_date"),
                                    "acq_time": hotspot.get("acq_time"),
                                    "satellite": hotspot.get("satellite"),
                                    "instrument": hotspot.get("instrument"),
                                    "version": hotspot.get("version")
                                }
                            }
                            for hotspot in data
                        ]
                    }

                    return JSONResponse(content=geojson_data)
                else:
                    raise HTTPException(status_code=500, detail="Failed to fetch FIRMS data from both sources")

            return JSONResponse(content=response.json())

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching FIRMS data: {str(e)}")
