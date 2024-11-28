const UserModel = require("../models/users");

exports.getByCredentials = (username) => {
  return UserModel.query()
    .select(
      "users.id",
      "users.role_id",
      "users.username",
      "users.phone",
      "users.password",
      "users.photo",
      "roles.role",
      "roles.slug",
      "users.created_at",
      "users.updated_at",
    )
    .joinRelated("roles")
    .where("users.username", username)
    .first();
}