"""
Test script for Google Earth Engine service
Run this to verify GEE authentication is working
"""
import os
import sys

# Add app directory to path
sys.path.insert(0, os.path.dirname(__file__))

def test_gee_initialization():
    """Test GEE service initialization"""
    print("=" * 60)
    print("Testing Google Earth Engine Service")
    print("=" * 60)

    try:
        from app.services.gee_service import GEEService

        print("\n1. Initializing GEE Service...")
        gee = GEEService()
        print("   ✓ GEE Service initialized successfully!")

        print("\n2. Testing NDMI layer retrieval...")
        result = gee.get_ndmi_layer(
            area_code='ud',
            end_date='2024-12-31',
            days_composite=30
        )

        print("   ✓ NDMI layer retrieved successfully!")
        print(f"   - Tile URL: {result['tile_url'][:80]}...")
        print(f"   - Bounds: {len(result['bounds'])} coordinates")
        if 'stats' in result:
            print(f"   - Statistics:")
            for key, value in result['stats'].items():
                if isinstance(value, float):
                    print(f"     • {key}: {value:.4f}")
                else:
                    print(f"     • {key}: {value}")

        print("\n3. Testing study areas...")
        study_areas = ['ud', 'mt', 'ky', 'vs', 'ms']
        for area in study_areas:
            try:
                area_fc = gee.get_study_area(area)
                print(f"   ✓ Study area '{area}' loaded successfully")
            except Exception as e:
                print(f"   ✗ Study area '{area}' failed: {str(e)}")

        print("\n" + "=" * 60)
        print("✓ All tests passed! GEE is working correctly.")
        print("=" * 60)

        return True

    except Exception as e:
        print(f"\n✗ Error: {str(e)}")
        print("\nTroubleshooting:")
        print("1. Check that sakdagee-aac5df75dc7f.json exists in fastapi/ directory")
        print("2. Verify GEE_SERVICE_ACCOUNT environment variable is set")
        print("3. Ensure earthengine-api is installed: pip install earthengine-api")
        print("4. Check service account has Earth Engine permissions")
        return False

if __name__ == "__main__":
    success = test_gee_initialization()
    sys.exit(0 if success else 1)
