const ParkingSpotHistoryService = require("../services/spot-history-service");
const db = require("../db-connection");
const parkingSpotHistoryService = new ParkingSpotHistoryService(db);
const geolib = require("geolib");

class ParkingSpotService {
  constructor(db) {
    this.db = db;
  }

  async getClosestFreeParkingSpot(startLatitude, startLongitude) {
    try {
      const parkingSpots = await this.getAllFreeParkingSpots();

      const closestFreeSpot = geolib.findNearest(
        { latitude: startLatitude, longitude: startLongitude },
        parkingSpots.map((spot) => ({
          latitude: spot.latitude,
          longitude: spot.longitude,
          key: spot.parkingSpotId,
        }))
      );

      const closestParkingSpot = await this.getParkingSpotById(
        closestFreeSpot.key
      );
      return closestParkingSpot;
    } catch (error) {
      throw new Error(
        `Unable to find closest free parking spot from coordinates (${startLatitude}, ${startLongitude}): ${error.message}`
      );
    }
  }

  async getParkingSpotCoordinatesById(spotId) {
    const query = `
      SELECT
      (psc.coordinates)[0] AS latitude,
      (psc.coordinates)[1] AS longitude
    FROM public."parking_spots" ps
    JOIN public."parking_spot_coordinates" psc
      ON ps.parking_spot_id = psc.parking_spot_id
      WHERE ps.parking_spot_id = $1 
    `;

    const values = [spotId];

    try {
      const { rows } = await this.db.query(query, values);
      if (rows.length > 0) {
        const row = rows[0];
        return {
          longitude: row.longitude,
          latitude: row.latitude,
        };
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        `Unable to retrieve coordinates of parking spot with ID ${spotId}: ${error.message}`
      );
    }
  }

  async getParkingSpotStateById(spotId) {
    const query = `
    SELECT
      name,
      occupied
    FROM public."parking_spots"
    WHERE parking_spot_id = $1;
  `;
    const values = [spotId];

    try {
      const { rows } = await this.db.query(query, values);
      if (rows.length > 0) {
        const row = rows[0];
        return {
          name: row.name,
          occupied: row.occupied,
        };
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        `Unable to retrieve parking spot state: ${error.message}`
      );
    }
  }

  async getParkingSpotById(spotId) {
    const query = `
      SELECT
        ps.parking_spot_id,
        ps.name,
        ps.occupied,
        ps.updated_at,
        (psc.coordinates)[0] AS latitude,
        (psc.coordinates)[1] AS longitude
      FROM public."parking_spots" ps
      LEFT JOIN public."parking_spot_coordinates" psc
        ON ps.parking_spot_id = psc.parking_spot_id
      WHERE ps.parking_spot_id = $1;
    `;
    const values = [spotId];

    try {
      const { rows } = await this.db.query(query, values);
      if (rows.length > 0) {
        const row = rows[0];
        return {
          parkingSpotId: row.parking_spot_id,
          name: row.name,
          occupied: row.occupied,
          updatedAt: row.updated_at,
          longitude: row.longitude,
          latitude: row.latitude,
        };
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        `Unable to retrieve state of parking spot with ID ${spotId}: ${error.message}`
      );
    }
  }

  async updateParkingSpotOccupancy(parkingSpotId, occupied) {
    const query = `
      UPDATE public."parking_spots"
      SET occupied = $1, updated_at = CURRENT_TIMESTAMP
      WHERE parking_spot_id = $2
    `;
    const values = [occupied, parkingSpotId];

    try {
      await this.db.query(query, values);
      await parkingSpotHistoryService.updateParkingSpotHistory(
        parkingSpotId,
        occupied
      );
      return true;
    } catch (error) {
      throw new Error(
        `Unable to update occupancy of parking spot with ID ${parkingSpotId}: ${error.message}`
      );
    }
  }

  async getUserFavouriteSpot(userId) {
    const query = `
      SELECT
        ps.parking_spot_id,
        (psc.coordinates)[0] AS latitude,
        (psc.coordinates)[1] AS longitude
      FROM public."users" u
      LEFT JOIN public."parking_spots" ps
        ON u.favourite_spot_id = ps.parking_spot_id
      LEFT JOIN public."parking_spot_coordinates" psc
        ON ps.parking_spot_id = psc.parking_spot_id
      WHERE u.user_id = $1
    `;
    const values = [userId];

    try {
      const { rows } = await this.db.query(query, values);
      if (rows.length > 0) {
        const row = rows[0];
        if (row.parking_spot_id !== null) {
          const favouriteSpot = await this.getParkingSpotById(
            row.parking_spot_id
          );
          return favouriteSpot;
        }
      }
      return null;
    } catch (error) {
      throw new Error(
        `Unable to retrieve favourite parking spot of user with ID ${userId}: ${error.message}`
      );
    }
  }

  async getParkingSpotByName(spotName) {
    const query = `
      SELECT parking_spot_id, name, occupied, updated_at
      FROM public."parking_spots"
      WHERE name = $1;
    `;
    const values = [spotName];

    try {
      const { rows } = await this.db.query(query, values);
      if (rows.length > 0) {
        const row = rows[0];
        return {
          parkingSpotId: row.parking_spot_id,
          name: row.name,
          occupied: row.occupied,
          updatedAt: row.updated_at,
        };
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        `Unable to retrieve parking spot with name "${spotName}": ${error.message}`
      );
    }
  }

  async getAllParkingSpots() {
    const query = `
      SELECT
      ps.parking_spot_id,
      ps.name,
      ps.occupied,
      ps.updated_at,
      (psc.coordinates)[0] AS latitude,
      (psc.coordinates)[1] AS longitude
    FROM public."parking_spots" ps
    LEFT JOIN public."parking_spot_coordinates" psc
      ON ps.parking_spot_id = psc.parking_spot_id
    `;

    try {
      const { rows } = await this.db.query(query);
      return rows.map((row) => ({
        parkingSpotId: row.parking_spot_id,
        name: row.name,
        occupied: row.occupied,
        updatedAt: row.updated_at,
        latitude: row.latitude,
        longitude: row.longitude,
      }));
    } catch (error) {
      throw new Error(`Unable to retrieve all parking spots: ${error.message}`);
    }
  }

  async getLastDateOfLastSuccessfulUpdate() {
    const query = `
      SELECT
        updated_at
      FROM public."detection_updates"
      WHERE success = true
        ORDER BY updated_at DESC
        LIMIT 1
    `;

    try {
      const { rows } = await this.db.query(query);
      if (rows.length > 0) {
        const row = rows[0];
        return row.updated_at;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        `Unable to retrieve last successful execution of detection: ${error.message}`
      );
    }
  }

  async getAllFreeParkingSpots() {
    const query = `
      SELECT
      ps.parking_spot_id,
      ps.name,
      ps.occupied,
      ps.updated_at,
      (psc.coordinates)[0] AS latitude,
      (psc.coordinates)[1] AS longitude
    FROM public."parking_spots" ps
    LEFT JOIN public."parking_spot_coordinates" psc
      ON ps.parking_spot_id = psc.parking_spot_id
    WHERE ps.occupied = false
    `;

    try {
      const { rows } = await this.db.query(query);
      return rows.map((row) => ({
        parkingSpotId: row.parking_spot_id,
        latitude: row.latitude,
        longitude: row.longitude,
      }));
    } catch (error) {
      throw new Error(
        `Unable to retrieve all free parking spots: ${error.message}`
      );
    }
  }
}

module.exports = ParkingSpotService;
