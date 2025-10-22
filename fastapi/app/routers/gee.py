from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
from app.services.gee_service import GEEService

router = APIRouter(prefix="/gee", tags=["Google Earth Engine"])

# Initialize GEE service
gee_service = GEEService()

@router.get("/ndmi")
async def get_ndmi_drought_layer(
    area: str = Query(..., description="Study area code (ud, mt, ky, vs, ms)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    days: int = Query(30, description="Days for composite", ge=1, le=365)
):
    """
    Get NDMI (Normalized Difference Moisture Index) drought monitoring layer

    - **area**: Study area code (ud=Uttaradit, mt=Mae Tha, ky=Khun Yuam, vs=Wiang Sa, ms=Mae Sariang)
    - **end_date**: End date for analysis (defaults to today)
    - **days**: Number of days for composite (default 30)
    """
    try:
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')

        result = gee_service.get_ndmi_layer(area, end_date, days)
        return {
            "success": True,
            "data": result,
            "layer_type": "ndmi",
            "area": area,
            "end_date": end_date,
            "days_composite": days
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/ndvi")
async def get_ndvi_layer(
    area: str = Query(..., description="Study area code"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    days: int = Query(30, description="Days for composite", ge=1, le=365)
):
    """
    Get NDVI (Normalized Difference Vegetation Index) layer
    """
    try:
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')

        result = gee_service.get_ndvi_layer(area, end_date, days)
        return {
            "success": True,
            "data": result,
            "layer_type": "ndvi",
            "area": area,
            "end_date": end_date,
            "days_composite": days
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/ndwi")
async def get_ndwi_layer(
    area: str = Query(..., description="Study area code"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    days: int = Query(30, description="Days for composite", ge=1, le=365)
):
    """
    Get NDWI (Normalized Difference Water Index) layer
    """
    try:
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')

        result = gee_service.get_ndwi_layer(area, end_date, days)
        return {
            "success": True,
            "data": result,
            "layer_type": "ndwi",
            "area": area,
            "end_date": end_date,
            "days_composite": days
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/burn-scar")
async def get_burn_scar_layer(
    area: str = Query(..., description="Study area code"),
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    cloud_cover: int = Query(30, description="Max cloud cover %", ge=0, le=100)
):
    """
    Get burn scar detection layer using NBR and NIRBI indices

    - **area**: Study area code
    - **start_date**: Start date for analysis (defaults to 30 days ago)
    - **end_date**: End date for analysis (defaults to today)
    - **cloud_cover**: Maximum cloud cover percentage (default 30%)

    Returns both NBR layer and detected burn scars
    """
    try:
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')
        if not start_date:
            start = datetime.now() - timedelta(days=30)
            start_date = start.strftime('%Y-%m-%d')

        result = gee_service.get_burn_scar_layer(area, start_date, end_date, cloud_cover)
        return {
            "success": True,
            "data": result,
            "layer_type": "burn_scar",
            "area": area,
            "start_date": start_date,
            "end_date": end_date,
            "cloud_cover": cloud_cover
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/biomass")
async def get_biomass_layer(
    area: str = Query(..., description="Study area code"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    days: int = Query(30, description="Days for composite", ge=1, le=365)
):
    """
    Get 3PGs biomass estimation layers

    - **area**: Study area code
    - **end_date**: End date for analysis (defaults to today)
    - **days**: Number of days for composite (default 30)

    Returns:
    - NDVI layer
    - Biomass 3PGs layer (kg/m²)
    - Biomass Equation layer (Parinwat & Sakda equation)
    """
    try:
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')

        result = gee_service.get_biomass_layer(area, end_date, days)
        return {
            "success": True,
            "data": result,
            "layer_type": "biomass",
            "area": area,
            "end_date": end_date,
            "days_composite": days
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/study-areas")
async def get_study_areas():
    """
    Get list of available study areas
    """
    return {
        "success": True,
        "data": {
            "ud": {"name": "Pak Thap, Uttaradit", "name_th": "ปากทับ อุตรดิตถ์"},
            "mt": {"name": "Mae Tha, Chiang Mai", "name_th": "แม่ทาเหนือ เชียงใหม่"},
            "ky": {"name": "Khun Yuam, Mae Hong Son", "name_th": "ขุนยวม แม่ฮ่องสอน"},
            "vs": {"name": "Wiang Sa, Nan", "name_th": "เวียงสา น่าน"},
            "ms": {"name": "Mae Sariang, Mae Hong Son", "name_th": "แม่สะเรียง แม่ฮ่องสอน"},
            "st": {"name": "Sob Tia, Chiang Mai", "name_th": "สบเตี๊ยะ เชียงใหม่"}
        }
    }
