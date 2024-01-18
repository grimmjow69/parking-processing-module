class Notification {
  constructor({ notificationId, parkingSpotId, userId, createdAt }) {
    this.notificationId = notificationId;
    this.parkingSpotId = parkingSpotId;
    this.userId = userId;
    this.createdAt = createdAt;
  }
}

module.exports = Notification;
