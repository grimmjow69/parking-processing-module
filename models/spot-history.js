class ParkingSpotHistory {
  constructor({ id, parkingSpotId, occupied, occupiedSince }) {
    this.id = id;
    this.parkingSpotId = parkingSpotId;
    this.occupied = occupied;
    this.occupiedSince = occupiedSince;
  }
}

module.exports = ParkingSpotHistory;