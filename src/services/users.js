"use strict";

const UserModel = require("../models/users");

class UserService {
  static getUsers = async (offset, limit, search, filterRole) => {
    let query = UserModel.query()
      .select(
        "users.id",
        "users.role_id",
        "users.username",
        "users.phone",
        "users.photo",
        "roles.role",
        "roles.slug",
        "users.created_at",
        "users.updated_at",
      )
      .joinRelated("roles")
      .whereILike("users.username", "%" + search + "%")
      .offset(offset)
      .limit(limit)
      .orderBy("id", "DESC");

    if (filterRole) {
      query.andWhere("users.role_id", filterRole)
    };

    return await query;
  }

  static getById = (id) => {
    return UserModel.query()
      .select(
        "users.id",
        "users.role_id",
        "users.username",
        "users.phone",
        "users.photo",
        "roles.role",
        "roles.slug",
        "users.created_at",
        "users.updated_at",
      )
      .joinRelated("roles")
      .where("users.id", id)
      .first();
  }

  static createUser = (data) => {
    return UserModel.query()
      .insert(data);
  }

  static updateUser = async (id, data) => {
    return UserModel.query()
      .patchAndFetchById(id, data);
  }

  static deleteUser = (id) => {
    return UserModel.query()
      .where("id", id)
      .delete();
  }

  static checkDuplicateUser = (username) => {
    return UserModel.query()
      .select(
        "users.id",
        "users.role_id",
        "users.username",
        "users.phone",
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
}

module.exports = UserService;