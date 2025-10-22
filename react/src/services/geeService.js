const API_BASE_URL = 'http://localhost:8000';

export const geeService = {
  /**
   * Get NDMI drought layer
   * @param {string} area - Study area code (ud, mt, ky, vs, ms)
   * @param {string} endDate - End date YYYY-MM-DD
   * @param {number} days - Days for composite
   */
  async getNDMILayer(area, endDate, days = 30) {
    const params = new URLSearchParams({
      area,
      ...(endDate && { end_date: endDate }),
      days
    });

    const response = await fetch(`${API_BASE_URL}/gee/ndmi?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch NDMI layer');
    }
    return response.json();
  },

  /**
   * Get NDVI layer
   * @param {string} area - Study area code
   * @param {string} endDate - End date YYYY-MM-DD
   * @param {number} days - Days for composite
   */
  async getNDVILayer(area, endDate, days = 30) {
    const params = new URLSearchParams({
      area,
      ...(endDate && { end_date: endDate }),
      days
    });

    const response = await fetch(`${API_BASE_URL}/gee/ndvi?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch NDVI layer');
    }
    return response.json();
  },

  /**
   * Get NDWI water layer
   * @param {string} area - Study area code
   * @param {string} endDate - End date YYYY-MM-DD
   * @param {number} days - Days for composite
   */
  async getNDWILayer(area, endDate, days = 30) {
    const params = new URLSearchParams({
      area,
      ...(endDate && { end_date: endDate }),
      days
    });

    const response = await fetch(`${API_BASE_URL}/gee/ndwi?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch NDWI layer');
    }
    return response.json();
  },

  /**
   * Get burn scar layer
   * @param {string} area - Study area code
   * @param {string} startDate - Start date YYYY-MM-DD
   * @param {string} endDate - End date YYYY-MM-DD
   * @param {number} cloudCover - Max cloud cover percentage
   */
  async getBurnScarLayer(area, startDate, endDate, cloudCover = 30) {
    const params = new URLSearchParams({
      area,
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      cloud_cover: cloudCover
    });

    const response = await fetch(`${API_BASE_URL}/gee/burn-scar?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch burn scar layer');
    }
    return response.json();
  },

  /**
   * Get biomass layers (3PGs and equation-based)
   * @param {string} area - Study area code
   * @param {string} endDate - End date YYYY-MM-DD
   * @param {number} days - Days for composite
   */
  async getBiomassLayer(area, endDate, days = 30) {
    const params = new URLSearchParams({
      area,
      ...(endDate && { end_date: endDate }),
      days
    });

    const response = await fetch(`${API_BASE_URL}/gee/biomass?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch biomass layer');
    }
    return response.json();
  },

  /**
   * Get list of available study areas
   */
  async getStudyAreas() {
    const response = await fetch(`${API_BASE_URL}/gee/study-areas`);
    if (!response.ok) {
      throw new Error('Failed to fetch study areas');
    }
    return response.json();
  }
};
