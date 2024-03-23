class ParkingSpotHistoryService {
  constructor(db) {
    this.db = db;
  }

  async updateParkingSpotHistory(parkingSpotId, occupied) {
    const query = `
      INSERT INTO public."parking_spot_histories" (parking_spot_id, occupied, updated_at)
      VALUES ($1, $2, NOW())
      RETURNING *;
    `;

    const values = [parkingSpotId, occupied];

    const { rows } = await this.db.query(query, values);
    if (rows.length > 0) {
      return rows[0];
    } else {
      throw new Error("Insertion of new parking spot history failed.");
    }
  }

  async getHistoryOccupancyCount() {
    const query = `
      SELECT p.name,
             COALESCE(COUNT(h.history_id), 0) AS times_occupied,
             c.longitude,
             c.latitude
      FROM public."parking_spots" p
      LEFT JOIN public."parking_spot_histories" h
        ON p.parking_spot_id = h.parking_spot_id AND h.occupied = true
      LEFT JOIN (
        SELECT
          parking_spot_id,
          (coordinates[0])::float AS latitude,
          (coordinates[1])::float AS longitude
        FROM public."parking_spot_coordinates"
      ) c
        ON p.parking_spot_id = c.parking_spot_id
      GROUP BY p.name, c.longitude, c.latitude
    `;

    try {
      const { rows } = await this.db.query(query);
      const occupancyCountMap = {};
      rows.forEach((row) => {
        occupancyCountMap[row.name] = {
          timesOccupied: parseInt(row.times_occupied),
          longitude: row.longitude,
          latitude: row.latitude,
        };
      });
      return occupancyCountMap;
    } catch (error) {
      throw new Error(
        `Unable to retrieve occupancy count by parking spot name with coordinates: ${error.message}`
      );
    }
  }

  async getLastParkingSpotHistoryRecord(parkingSpotId) {
    const query = `
      SELECT history_id, parking_spot_id, occupied, occupied_since, updated_at
      FROM public."parking_spot_histories"
      WHERE parking_spot_id = $1
      ORDER BY updated_at DESC
      LIMIT 1;
    `;

    const values = [parkingSpotId];

    try {
      const { rows } = await this.db.query(query, values);
      if (rows.length > 0) {
        const row = rows[0];
        return {
          historyId: row.history_id,
          parkingSpotId: row.parking_spot_id,
          occupied: row.occupied,
          updatedAt: row.updated_at,
        };
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        `Unable to retrieve parking spot history: ${error.message}`
      );
    }
  }

  async getTimeSinceStatusChange(parkingSpotId) {
    const query = `
      SELECT
        occupied,
        updated_at
      FROM public."parking_spot_histories"
      WHERE parking_spot_id = $1
      ORDER BY updated_at DESC
    `;

    const values = [parkingSpotId];

    try {
      const { rows } = await this.db.query(query, values);

      if (rows.length <= 1) {
        return null;
      }

      const currentStatus = rows[0].occupied;
      const statusChangeEvent = rows.find((row, index) => {
        return index > 0 && row.occupied !== currentStatus;
      });

      if (statusChangeEvent) {
        return statusChangeEvent.updated_at;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        `Unable to retrieve the time since the last status change: ${error.message}`
      );
    }
  }

  async getParkingSpotHistoryById(parkingSpotId) {
    const query = `
      SELECT history_id, parking_spot_id, occupied, occupied_since, updated_at
      FROM public."parking_spot_histories"
      WHERE parking_spot_id = $1
      ORDER BY updated_at desc
    `;

    const values = [parkingSpotId];

    try {
      const { rows } = await this.db.query(query, values);
      if (rows.length > 0) {
        return rows.map((row) => ({
          occupied: row.occupied,
          occupiedSince: row.occupied_since,
          updatedAt: row.updated_at,
        }));
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        `Unable to retrieve parking spot history: ${error.message}`
      );
    }
  }
}

module.exports = ParkingSpotHistoryService;
