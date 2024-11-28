"use strict";

const PelangganModel = require("../models/pelanggan");

class PelangganService {
  static getPelanggans = async (offset, limit, search) => {
    let query = PelangganModel.query()
      .select(
        "pelanggan.id",
        "pelanggan.name",
        "pelanggan.address",
        "pelanggan.phone",
        "pelanggan.created_at",
        "pelanggan.updated_at",
      )
      .whereILike("pelanggan.name", "%" + search + "%")
      .offset(offset)
      .limit(limit)
      .orderBy("id", "DESC");

    return await query;
  }

  static getById = (id) => {
    return PelangganModel.query()
      .select(
        "pelanggan.id",
        "pelanggan.name",
        "pelanggan.address",
        "pelanggan.phone",
        "pelanggan.created_at",
        "pelanggan.updated_at",
      )
      .where("pelanggan.id", id)
      .first();
  }

  static createPelanggan = (data) => {
    return PelangganModel.query()
      .insert(data);
  }

  static updatePelanggan = async (id, data) => {
    return PelangganModel.query()
      .patchAndFetchById(id, data);
  }

  static deletePelanggan = (id) => {
    return PelangganModel.query()
      .where("id", id)
      .delete();
  }
}

module.exports = PelangganService;