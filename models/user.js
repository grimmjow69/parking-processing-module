class User {
  constructor({
    userId,
    email,
    password,
    createdAt,
    updatedAt,
    favouriteSpotId,
  }) {
    this.userId = userId;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.favouriteSpotId = favouriteSpotId;
  }
}

module.exports = User;
