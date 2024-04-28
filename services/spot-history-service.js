const { pool } = require("../db-connection");

class ParkingSpotHistoryService {
  constructor() {
    this.db = pool;
  }

  async addSpotHistoryRecord(parkingSpotId, occupied) {
    const query = `
      INSERT INTO public."parking_spot_histories" (parking_spot_id, occupied, updated_at)
      VALUES ($1, $2, NOW())
      RETURNING *;
    `;

    const values = [parkingSpotId, occupied];

    try {
      const { rows } = await this.db.query(query, values);
      if (rows.length > 0) {
        return rows[0];
      } else {
        throw new Error("Failed to insert new parking spot history.");
      }
    } catch (error) {
      throw new Error("Failed to insert new parking spot history.");
    }
  }

  async getHistoryOccupancyCount() {
    const query = `
      WITH OccupiedDurations AS (
        SELECT
          p.parking_spot_id,
          p.name,
          h.occupied,
          h.updated_at,
          LEAD(h.updated_at) OVER (PARTITION BY p.parking_spot_id ORDER BY h.updated_at) AS next_update_at
        FROM public.parking_spots p
        JOIN public.parking_spot_histories h ON p.parking_spot_id = h.parking_spot_id
      ),
      Durations AS (
        SELECT
          parking_spot_id,
          name,
          occupied,
          updated_at,
          next_update_at,
          -- Extract the duration in hours, only calculate if the spot was occupied and there's a next update time
          CASE WHEN occupied = true AND next_update_at IS NOT NULL THEN
            EXTRACT(EPOCH FROM (next_update_at - updated_at)) / 3600
          ELSE
            0
          END AS hours_occupied,
          EXTRACT(EPOCH FROM (next_update_at - updated_at)) / 3600 AS raw_hours -- Debug information
        FROM OccupiedDurations
      )
      SELECT
        d.name,
        SUM(d.hours_occupied) AS total_hours_occupied,
        c.latitude,
        c.longitude,
        ARRAY_AGG(d.raw_hours ORDER BY d.updated_at) AS debug_hours, -- Collect raw durations for debugging
        ARRAY_AGG(d.updated_at ORDER BY d.updated_at) AS updated_times, -- Collect update times for debugging
        ARRAY_AGG(d.next_update_at ORDER BY d.updated_at) AS next_update_times -- Collect next update times for debugging
      FROM Durations d
      LEFT JOIN (
        SELECT
          parking_spot_id,
          (coordinates[0])::float AS latitude,
          (coordinates[1])::float AS longitude
        FROM public.parking_spot_coordinates
      ) c ON d.parking_spot_id = c.parking_spot_id
      GROUP BY d.name, c.latitude, c.longitude
    `;

    try {
      const { rows } = await this.db.query(query);
      const occupancyCountMap = {};
      const maxHoursOccupied = Math.max(...rows.map(row => row.total_hours_occupied));
      
      rows.forEach((row) => {
        const normalizedWeight = (row.total_hours_occupied / maxHoursOccupied) * 255;
        
        occupancyCountMap[row.name] = {
          weight: Math.round(normalizedWeight), 
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
      SELECT history_id, parking_spot_id, occupied, updated_at
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
        `Unable to retrieve last parking spot history record for parking spot ID ${parkingSpotId}: ${error.message}`
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

      if (rows.length == 0) {
        return null;
      }

      const currentStatus = rows[0].occupied;
      let statusChangeEvent = null;

      for (let i = 0; i < rows.length; i++) {
        if (rows[i].occupied === currentStatus) {
          statusChangeEvent = rows[i];
        } else {
          break;
        }
      }

      if (statusChangeEvent) {
        return statusChangeEvent.updated_at;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        `Unable to retrieve the time since the last status change for parking spot ID ${parkingSpotId}: ${error.message}`
      );
    }
  }

  async getParkingSpotHistoryById(parkingSpotId) {
    const query = `
      SELECT history_id, parking_spot_id, occupied, updated_at
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
          updatedAt: row.updated_at,
        }));
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        `Unable to retrieve parking spot history for parking spot ID ${parkingSpotId}: ${error.message}`
      );
    }
  }
}

module.exports = ParkingSpotHistoryService;
