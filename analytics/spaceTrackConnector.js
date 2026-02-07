/**
 * Space-Track API Connector
 * Handles TLE data retrieval and processing
 */

const axios = require('axios');

class SpaceTrackConnector {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.baseURL = 'https://www.space-track.org/api';
  }

  /**
   * Authenticate with Space-Track API
   */
  async authenticate() {
    try {
      const response = await axios.post(
        `${this.baseURL}/auth/login`,
        `identity=${this.username}&password=${this.password}`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      return response.status === 200;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  /**
   * Fetch TLE data for debris objects in specific altitude range
   */
  async fetchTLEData(altitudeMin, altitudeMax) {
    try {
      // Format: DECAY_DATE>1900-01-01&format=json
      const query = `/tle/query/class/TLE_DATA/DECAY_DATE/>now-30/format/json`;
      const response = await axios.get(`${this.baseURL}${query}`);
      return this.filterByAltitude(response.data, altitudeMin, altitudeMax);
    } catch (error) {
      console.error('Failed to fetch TLE data:', error);
      return [];
    }
  }

  /**
   * Filter TLE data by altitude range
   */
  filterByAltitude(tleData, minAlt, maxAlt) {
    return tleData.filter(tle => {
      const altitude = this.calculateAltitude(tle);
      return altitude >= minAlt && altitude <= maxAlt;
    });
  }

  /**
   * Calculate altitude from TLE mean motion
   * Simple approximation
   */
  calculateAltitude(tle) {
    // Mean motion to altitude approximation
    const n = parseFloat(tle.MEAN_MOTION);
    const radius = Math.pow(398600.4418 / Math.pow(n * 2 * Math.PI / 86400, 2), 1/3);
    return radius - 6371; // Earth radius
  }
}

module.exports = SpaceTrackConnector;
