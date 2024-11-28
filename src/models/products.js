"use strict";

const { Model } = require("objection");

class ProductModel extends Model {
  static get tableName() {
    return "products";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "price", "stok", "category"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 256 },
        price: { type: "number" },
        stok: { type: "integer" },
        category: { type: "string", enum: ["Makanan", "Minuman", "Snack", "Paket"], }
      }
    }
  }
}

module.exports = ProductModel;