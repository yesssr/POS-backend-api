"use strict";

const { Model } = require("objection");

class UserModel extends Model {
  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["role_id", "username", "phone", "photo"],
      properties: {
        id: { type: "integer" },
        role_id: { type: "integer" },
        username: { type: "string", minLength: 1, maxLength: 256 },
        phone: { type: "string", minLength: 1, maxLength: 15 },
      }
    }
  }

  static get relationMappings() {
    const RoleModel = require("./roles");
    return {
      roles: {
        relation: Model.BelongsToOneRelation,
        modelClass: RoleModel,
        join: {
          from: "users.role_id",
          to: "roles.id"
        }
      }
    }
  }
}

module.exports = UserModel;