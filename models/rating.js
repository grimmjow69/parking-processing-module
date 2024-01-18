class Rating {
  constructor({ id, userId, parkingSpotId, rating, comment, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.parkingSpotId = parkingSpotId;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = createdAt;
  }
}

module.exports = Rating;
