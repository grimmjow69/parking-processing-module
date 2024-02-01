class ParkingSpotHistory {
  constructor({ historyId, parkingSpotId, occupied, occupiedSince }) {
    this.historyId = historyId;
    this.parkingSpotId = parkingSpotId;
    this.occupied = occupied;
    this.occupiedSince = occupiedSince;
  }
}

module.exports = ParkingSpotHistory;