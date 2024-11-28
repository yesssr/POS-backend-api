"use strict";

const { Model } = require("objection");

class PelangganModel extends Model {
  static get tableName() {
    return "pelanggan";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "address", "phone"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 256 },
        address: { type: "string" },
        phone: { type: "string", minLength: 1, maxLength: 15 },
      }
    }
  }
}

module.exports = PelangganModel;