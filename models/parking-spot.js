class ParkingSpot {
  constructor({ parkingSpotId, name, occupied, updatedAt, latitude, longitude }) {
    this.parkingSpotId = parkingSpotId;
    this.name = name;
    this.occupied = occupied;
    this.updatedAt = updatedAt;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

module.exports = ParkingSpot;
