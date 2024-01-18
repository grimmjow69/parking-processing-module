class User {
  constructor({ id, username, email, password, profilePhoto }) {
    this.userId = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.profilePhoto = profilePhoto;
  }
}

module.exports = User;
