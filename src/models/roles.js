"use strict";

const { Model } = require("objection");

class RoleModel extends Model {
  static get tableName() {
    return 'roles';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['role'],
      properties: {
        id: { type: 'integer' },
        role: { type: 'string', minLength: 1, maxLength: 128 }
      }
    }
  }
}

module.exports = RoleModel;