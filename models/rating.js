class Rating {
  constructor({ ratingId, userId, parkingSpotId, rating, comment, createdAt }) {
    this.ratingId = ratingId;
    this.userId = userId;
    this.parkingSpotId = parkingSpotId;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = createdAt;
  }
}

module.exports = Rating;
