# Google Earth Engine Setup with Service Account

This guide explains how to set up Google Earth Engine authentication using your service account.

## Service Account Authentication (Recommended for Production)

Your project is already configured to use service account authentication with the file `sakdagee-aac5df75dc7f.json`.

### What's Already Done

✅ Service account JSON file: `fastapi/sakdagee-aac5df75dc7f.json`
✅ `.gitignore` updated to exclude the service account file
✅ GEE Service updated to use service account authentication
✅ Docker Compose configured with GEE_SERVICE_ACCOUNT environment variable
✅ Automatic initialization on FastAPI startup

### How It Works

1. **Service Account File**: The JSON file contains credentials for the service account `gee-apsco@sakdagee.iam.gserviceaccount.com`

2. **Automatic Authentication**: When FastAPI starts, the GEE service automatically:
   - Reads the service account JSON file from `/app/sakdagee-aac5df75dc7f.json`
   - Creates OAuth2 credentials
   - Initializes Earth Engine with these credentials

3. **No Manual Authentication Needed**: Unlike personal accounts, service accounts don't require browser-based OAuth flows.

## Starting the Application

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

The FastAPI service will automatically authenticate with GEE on startup.

### Option 2: Running FastAPI Locally

If you want to run FastAPI outside Docker:

```bash
cd fastapi

# Install dependencies
pip install -r requirements.txt

# Set environment variable
export GEE_SERVICE_ACCOUNT="./sakdagee-aac5df75dc7f.json"

# Run FastAPI
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Verifying GEE Authentication

### 1. Check FastAPI Logs

When FastAPI starts, you should see:

```
✓ Earth Engine initialized with service account: /app/sakdagee-aac5df75dc7f.json
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 2. Test API Endpoints

Visit the API documentation at http://localhost:8000/docs and try these endpoints:

#### Test 1: Get Study Areas
```
GET http://localhost:8000/gee/study-areas
```

#### Test 2: Get NDMI Layer
```
GET http://localhost:8000/gee/ndmi?area=ud&end_date=2024-12-31&days=30
```

If authentication is successful, you'll receive a JSON response with:
- `tile_url`: The Google Earth Engine tile URL
- `vis_params`: Visualization parameters
- `bounds`: Geographic bounds
- `stats`: Statistical information

### 3. Check for Errors

If authentication fails, you'll see one of these errors:

**Error: Service account file not found**
```json
{
  "detail": "Failed to initialize Earth Engine: [Errno 2] No such file or directory: '/app/sakdagee-aac5df75dc7f.json'"
}
```
**Solution**: Make sure the JSON file is in the `fastapi/` directory.

**Error: Invalid credentials**
```json
{
  "detail": "Failed to initialize Earth Engine: Invalid service account credentials"
}
```
**Solution**: Check that the JSON file is not corrupted and contains valid credentials.

## Service Account Permissions

Your service account `gee-apsco@sakdagee.iam.gserviceaccount.com` has access to:

- ✅ Google Earth Engine API
- ✅ Your project assets in `projects/ee-sakda-451407/assets/fire/`
  - Study areas: paktab, meatha_n, khunyoam, winagsa, measariang, etc.
- ✅ Public Earth Engine datasets:
  - Sentinel-2 (COPERNICUS/S2_SR_HARMONIZED, COPERNICUS/S2_SR)
  - MODIS (MODIS/061/MOD09GA, MODIS/062/MCD18A1)

## Environment Variables

The application uses these environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `GEE_SERVICE_ACCOUNT` | `/app/sakdagee-aac5df75dc7f.json` | Path to service account JSON file |

You can override these in:
- `docker-compose.yml` (for Docker)
- `.env` file (for local development)
- Shell environment (for manual testing)

## Security Best Practices

### ✅ What We've Done

1. **Excluded from Git**: The service account file is in `.gitignore`
2. **Docker Volume Mount**: The file is mounted as a volume, not copied into the image
3. **Environment Variable**: Path is configurable via environment variable

### ⚠️ Important Notes

1. **Never commit the JSON file to Git**
   - It's already in `.gitignore`
   - Contains private keys that grant access to your GEE project

2. **Rotate credentials if compromised**
   - If the JSON file is accidentally exposed, disable the service account in Google Cloud Console
   - Create a new service account and download new credentials

3. **Limit service account permissions**
   - Only grant the minimum required permissions
   - Currently has Earth Engine read/compute permissions

## Troubleshooting

### Issue: "Earth Engine not initialized"

**Symptoms**: API returns 500 errors with "Failed to initialize Earth Engine"

**Solutions**:
1. Check that `sakdagee-aac5df75dc7f.json` exists in `fastapi/` directory
2. Verify the JSON file is valid (not corrupted)
3. Check Docker logs: `docker-compose logs fastapi`
4. Restart the FastAPI service: `docker-compose restart fastapi`

### Issue: "Module 'ee' has no attribute 'Initialize'"

**Symptoms**: Import error or attribute error

**Solutions**:
1. Rebuild Docker image: `docker-compose build fastapi`
2. Check that `earthengine-api` is in `requirements.txt`
3. Install dependencies: `pip install -r requirements.txt`

### Issue: "Access denied to Earth Engine asset"

**Symptoms**: Error accessing specific datasets or assets

**Solutions**:
1. Verify the asset path is correct (e.g., `projects/ee-sakda-451407/assets/fire/paktab`)
2. Check that the service account has access to the asset in Google Earth Engine Code Editor
3. Make sure the asset is shared with your service account email

### Issue: Slow layer loading

**Symptoms**: API takes 10-30 seconds to respond

**Explanation**: This is normal! Earth Engine processing includes:
- Filtering satellite imagery by date and location
- Computing spectral indices (NDVI, NDMI, etc.)
- Calculating statistics
- Generating tile URLs

**Tips**:
- Use shorter date ranges (fewer days = faster)
- Implement caching on frequently used layers
- Show loading indicators in the React frontend

## Testing GEE Functionality

### Quick Test Script

Create a test file `fastapi/test_gee.py`:

```python
from app.services.gee_service import GEEService

# Initialize service
gee = GEEService()

# Test NDMI layer
result = gee.get_ndmi_layer(
    area_code='ud',
    end_date='2024-12-31',
    days_composite=30
)

print("✓ GEE Service working!")
print(f"Tile URL: {result['tile_url'][:50]}...")
print(f"Bounds: {result['bounds']}")
print(f"Stats: {result['stats']}")
```

Run it:
```bash
docker-compose exec fastapi python test_gee.py
```

## Next Steps

1. ✅ **Verify Authentication**: Check FastAPI logs for initialization message
2. ✅ **Test API**: Visit http://localhost:8000/docs and test endpoints
3. ✅ **Integrate with React**: Use the GEELayerControl component in your pages
4. ⏭️ **Add Caching**: Implement Redis caching for frequently requested layers
5. ⏭️ **Monitor Usage**: Track Earth Engine quota usage in Google Cloud Console

## Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f fastapi`
2. Review this documentation
3. Check [Google Earth Engine Python documentation](https://developers.google.com/earth-engine/guides/python_install)
4. Verify service account permissions in [Google Cloud Console](https://console.cloud.google.com)

---

**Service Account Email**: `gee-apsco@sakdagee.iam.gserviceaccount.com`
**Project ID**: `sakdagee`
**Earth Engine Project**: `ee-sakda-451407`
