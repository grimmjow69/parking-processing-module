const ParkingSpot = require("../models/parking-spot");
const ParkingSpotHistoryService = require("../services/spot-history-service");
const db = require("../db-connection");
const parkingSpotHistoryService = new ParkingSpotHistoryService(db);

class ParkingSpotService {
  constructor(db) {
    this.db = db;
  }

  async getParkingSpotCoordinatesById(spotId) {
    const query = `
      SELECT
      (psc.coordinates)[0] AS longitude,
      (psc.coordinates)[1] AS latitude
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
        `Unable to retrieve coordinates of parking spot: ${error.message}`
      );
    }
  }

  async getParkingSpotById(spotId) {
    const query = `
      SELECT parking_spot_id, name, occupied, updated_at
      FROM public."parking_spots"
      WHERE parking_spot_id = $1;
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
        };
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`Unable to retrieve parking spot: ${error.message}`);
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
        `Unable to update parking spot occupancy: ${error.message}`
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
        return new ParkingSpot({
          parkingSpotId: row.parking_spot_id,
          name: row.name,
          occupied: row.occupied,
          updatedAt: row.updated_at,
        });
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`Unable to retrieve parking spot: ${error.message}`);
    }
  }

  async getAllParkingSpots() {
    const query = `
      SELECT
      ps.parking_spot_id,
      ps.name,
      ps.occupied,
      ps.updated_at,
      (psc.coordinates)[0] AS longitude,
      (psc.coordinates)[1] AS latitude
    FROM public."parking_spots" ps
    LEFT JOIN public."parking_spot_coordinates" psc
      ON ps.parking_spot_id = psc.parking_spot_id
    `;

    try {
      const { rows } = await this.db.query(query);
      return rows.map(
        (row) =>
          new ParkingSpot({
            parkingSpotId: row.parking_spot_id,
            name: row.name,
            occupied: row.occupied,
            updatedAt: row.updated_at,
            latitude: row.latitude,
            longitude: row.longitude,
          })
      );
    } catch (error) {
      throw new Error(`Unable to retrieve all parking spots: ${error.message}`);
    }
  }
}

module.exports = ParkingSpotService;
