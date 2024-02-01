const ParkingSpotHistory = require("../models/spot-history");

class ParkingSpotHistoryService {
  constructor(db) {
    this.db = db;
  }

  async getHistoryOccupancyCount() {
    const query = `
      SELECT parking_spot_id, COUNT(*) AS times_occupied
      FROM public."parking_spot_histories"
      WHERE occupied = true
      GROUP BY parking_spot_id;
    `;

    try {
      const { rows } = await this.db.query(query);
      return rows.map((row) => ({
        parkingSpotId: row.parking_spot_id,
        timesOccupied: parseInt(row.times_occupied),
      }));
    } catch (error) {
      throw new Error(
        `Unable to retrieve occupancy count by parking spot id: ${error.message}`
      );
    }
  }

  async getParkingSpotHistoryById(parkingSpotId) {
    const query = `
      SELECT history_id, parking_spot_id, occupied, occupied_since
      FROM public."parking_spot_histories"
      WHERE parking_spot_id = parkingSpotId´
      GROUP BY $1;
    `;
    
    const values = [parkingSpotId];

    try {
      const { rows } = await this.db.query(query, values);
      if (rows.length > 0) {
        const row = rows[0];
        return new ParkingSpotHistory({
          historyId: row.history_id,
          parkingSpotId: row.parking_spot_id,
          occupied: row.occupied,
          occupiedSince: row.occupied_since,
        });
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`Unable to retrieve parking spot history: ${error.message}`);
    }
  }
}

module.exports = ParkingSpotHistoryService;
