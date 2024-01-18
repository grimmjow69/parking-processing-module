class ParkingSpot {
  constructor({ parkingSpotId, name, occupied, updatedAt }) {
    this.parkingSpotId = parkingSpotId;
    this.name = name;
    this.occupied = occupied;
    this.updatedAt = updatedAt;
  }
}

module.exports = ParkingSpot;
