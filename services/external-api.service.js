const axios = require("axios");
const ParkingSpotService = require("../services/parking-spot-service");
const db = require("../db-connection");
const parkingSpotService = new ParkingSpotService(db);

const { EXTERNAL_API_URL } = process.env;

class ExternalApiService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: EXTERNAL_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async fetchUpdatedParkingSpots() {
    try {
      const response = await this.apiClient.get("/get_parking_occupancy");
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch and update parking spots data - ${error.message}`
      );
      throw error;
    }
  }

  async updateParkingLotsWithNewData() {
    try {
      const newParkingSpotStates = await this.fetchUpdatedParkingSpots();

      for (const spots of Object.values(newParkingSpotStates)) {
        for (const spotData of spots) {
          const parkingSpot = await parkingSpotService.getParkingSpotByName(
            spotData.name
          );

          if (parkingSpot) {
            await parkingSpotService.updateParkingSpotOccupancy(
              parkingSpot.parkingSpotId,
              spotData.occupied
            );
          }
        }
      }
    } catch (error) {
      console.error("Error while updating parking spots:", error.message);
    }
  }
}

module.exports = ExternalApiService;
