class User {
  constructor({
    id,
    username,
    email,
    password,
    profilePhoto,
    createdAt,
    updatedAt,
    favouriteSpotId,
  }) {
    this.userId = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.profilePhoto = profilePhoto;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.favouriteSpotId = favouriteSpotId || null;
  }
}

module.exports = User;
