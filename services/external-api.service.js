const axios = require("axios");

const { EXTERNAL_API_URL, EXTERNAL_API_KEY } = process.env;

class ExternalApiService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: EXTERNAL_API_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${EXTERNAL_API_KEY}`,
      },
    });
  }

  async fetchUpdatedParkingSpots() {
    try {
      const response = await this.apiClient.get("/parking-spots");
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch and update parking spots data - ${error.message}`
      );
      throw error;
    }
  }

  async updateParkingLotsWithNewData() {
    // try {
    //   const newParkingSpotStates = await this.fetchUpdatedParkingSpots();

    //   for (const updatedParkingSpot of newParkingSpotStates) {
    //     const parkingSpot = await parkingSpotService.getParkingSpotByName(
    //       updatedParkingSpot.spotName
    //     );

    //     if (parkingSpot) {
    //       await parkingSpotService.updateParkingSpotOccupancy(
    //         parkingSpot.parkingSpotId,
    //         updatedParkingSpot.occupied
    //       );
    //     }
    //   }
    // } catch (error) {
    //   console.error("Error while updating parking spots:", error.message);
    // }
  }
}

module.exports = ExternalApiService;
