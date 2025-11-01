# GeoServer CORS Configuration

## Current Status
- GeoServer is running at http://localhost:8080/geoserver
- District layer `udfire:noth4prov_district_4326` is integrated into HotspotPredicting page
- CORS needs to be properly configured

## Solution Options

### Option 1: Use FastAPI as Proxy (Recommended)
Add a proxy endpoint in your FastAPI backend to forward WMS requests:

```python
# In fastapi/main.py or a new router
import httpx
from fastapi import APIRouter

router = APIRouter()

@router.get("/geoserver-proxy/{path:path}")
async def geoserver_proxy(path: str, request: Request):
    async with httpx.AsyncClient() as client:
        url = f"http://geoserver:8080/geoserver/{path}"
        response = await client.get(url, params=dict(request.query_params))
        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=dict(response.headers)
        )
```

Then update `GeoServerWMSLayer.jsx` to use:
```javascript
geoserverUrl = 'http://localhost:8000/geoserver-proxy/wms'
```

### Option 2: Manual CORS Configuration in GeoServer web.xml

1. Access the running container:
```bash
docker exec -it cmu_udfire_geoserver bash
```

2. Edit web.xml:
```bash
vi /opt/apache-tomcat-9.0.82/webapps/geoserver/WEB-INF/web.xml
```

3. Add this BEFORE the first `<filter>` tag:
```xml
<filter>
  <filter-name>CorsFilter</filter-name>
  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>
  <init-param>
    <param-name>cors.allowed.origins</param-name>
    <param-value>*</param-value>
  </init-param>
  <init-param>
    <param-name>cors.allowed.methods</param-name>
    <param-value>GET,POST,HEAD,OPTIONS,PUT,DELETE</param-value>
  </init-param>
  <init-param>
    <param-name>cors.allowed.headers</param-name>
    <param-value>*</param-value>
  </init-param>
</filter>

<filter-mapping>
  <filter-name>CorsFilter</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping>
```

4. Restart GeoServer:
```bash
docker-compose restart geoserver
```

### Option 3: NGINX Reverse Proxy
Add NGINX service to docker-compose.yml to handle CORS.

## Testing CORS
```bash
curl -H "Origin: http://localhost:3000" \
  -I "http://localhost:8080/geoserver/wms?service=WMS&version=1.1.0&request=GetCapabilities"
```

You should see:
```
Access-Control-Allow-Origin: *
```

## Current Integration

The district layer is already integrated in:
- Component: `react/src/components/GeoServerWMSLayer.jsx`
- Page: `react/src/pages/HotspotPredicting.jsx`
- Toggle: "ขอบเขตอำเภอ (Districts)" in the side panel

Once CORS is configured, the layer will display automatically!