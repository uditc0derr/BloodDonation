const haversine = require('haversine-distance');

/**
 * Calculate the distance between two coordinates using Haversine formula.
 * @param {Object} point1 - { latitude, longitude }
 * @param {Object} point2 - { latitude, longitude }
 * @returns {Number} Distance in meters
 */
const calculateDistance = (point1, point2) => {
  return haversine(point1, point2); // Returns distance in meters
};

/**
 * Find nearby users within a given radius.
 * @param {Array} users - List of users with location details
 * @param {Object} currentLocation - { latitude, longitude }
 * @param {Number} radius - Radius in meters
 * @returns {Array} Filtered list of nearby users
 */
const findNearbyUsers = (users, currentLocation, radius) => {
  return users.filter(user => {
    const userLocation = { latitude: user.location.coordinates[1], longitude: user.location.coordinates[0] };
    const distance = calculateDistance(currentLocation, userLocation);
    return distance <= radius;
  });
};

module.exports = { calculateDistance, findNearbyUsers };
