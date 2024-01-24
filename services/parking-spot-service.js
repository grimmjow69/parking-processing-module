const ParkingSpot = require("../models/parking-spot");

class ParkingSpotService {
  constructor(db) {
    this.db = db;
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

  async updateParkingSpotOccupancy(parkingSpotId, occupied) {
    const query = `
      UPDATE public."parking_spots"
      SET occupied = $1, updated_at = CURRENT_TIMESTAMP
      WHERE parking_spot_id = $1
    `;
    const values = [occupied];

    try {
      await this.db.query(query, values);
      // TO DO call parking spot history save and update
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
      SELECT parking_spot_id, name, occupied, updated_at
      FROM public."parking_spots"
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
          })
      );
    } catch (error) {
      throw new Error(`Unable to retrieve all parking spots: ${error.message}`);
    }
  }
}

module.exports = ParkingSpotService;
