class ParkingSpotHistory {
  constructor({ historyId, parkingSpotId, occupied, occupiedSince, updatedAt }) {
    this.historyId = historyId;
    this.parkingSpotId = parkingSpotId;
    this.occupied = occupied;
    this.occupiedSince = occupiedSince;
    this.updatedAt = updatedAt;
  }
}

module.exports = ParkingSpotHistory;