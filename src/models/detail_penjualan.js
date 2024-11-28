"use strict";

const { Model } = require('objection');

class DetailPenjualanModel extends Model {
  static get tableName() {
    return "detail_penjualan";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["penjualan_id", "product_id", "jumlah_product", "subtotal"],
      properties: {
        id: { type: "integer" },
        penjualan_id: { type: "integer" },
        product_id: { type: "integer" },
        jumlah_product: { type: "integer" },
        subtotal: { type: "number" },
      }
    }
  }

  static get relationMappings() {
    const ProductModel = require("./products");
    const PenjualanModel = require("./penjualan");

    return {
      products: {
        relation: Model.BelongsToOneRelation,
        modelClass: ProductModel,
        join: {
          from: "detail_penjualan.product_id",
          to: "products.id",
        }
      },

      penjualan: {
        relation: Model.BelongsToOneRelation,
        modelClass: PenjualanModel,
        join: {
          from: "detail_penjualan.penjualan_id",
          to: "penjualan.id",
        }
      }
    }
  }
}

module.exports = DetailPenjualanModel;