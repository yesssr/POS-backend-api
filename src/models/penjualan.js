"use strict";

const { Model } = require("objection");

class PenjualanModel extends Model {
  static get tableName() {
    return "penjualan";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["tanggal_penjualan", "total_harga", "total_bayar", "kembalian", "pelanggan_id",],
      properties: {
        id: { type: "integer" },
        tanggal_penjualan: { type: "string" },
        total_harga: { type: "number" },
        total_bayar: { type: "number" },
        kembalian: { type: "number" },
        pelanggan_id: { type: "integer" },
      }
    }
  }

  static get relationMappings() {
    const PelangganModel = require("./pelanggan");

    return {
      pelanggan: {
        relation: Model.BelongsToOneRelation,
        modelClass: PelangganModel,
        join: {
          from: "penjualan.pelanggan_id",
          to: "pelanggan.id",
        }
      }
    }
  }
}

module.exports = PenjualanModel;