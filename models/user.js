class User {
  constructor({
    userId,
    username,
    email,
    password,
    profilePhoto,
    createdAt,
    updatedAt,
    favouriteSpotId,
  }) {
    this.userId = userId;
    this.username = username;
    this.email = email;
    this.password = password;
    this.profilePhoto = profilePhoto;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.favouriteSpotId = favouriteSpotId;
  }
}

module.exports = User;
