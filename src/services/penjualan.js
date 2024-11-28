"use strict";

const PenjualanModel = require("../models/penjualan");

class PenjualanService {
  static getPenjualans = async (offset, limit, search, tanggal_penjualan) => {
    let query = PenjualanModel.query()
      .select(
        "penjualan.id",
        "penjualan.tanggal_penjualan",
        "penjualan.total_harga",
        "penjualan.total_bayar",
        "penjualan.kembalian",
        "penjualan.pelanggan_id",
        "pelanggan.name as pelanggan",
        "pelanggan.address",
        "pelanggan.phone"
      )
      .joinRelated("pelanggan")
      .whereLike("penjualan.id", "%" + search + "%")
      .offset(offset)
      .limit(limit)
      .orderBy("penjualan.id", "DESC");

    if (tanggal_penjualan) {
      query.andWhere("penjualan.tanggal_penjualan", tanggal_penjualan);
    }

    return await query;
  }

  static createPenjualan = (data) => {
    return PenjualanModel.query()
      .insert(data);
  }

  static updatePenjualan = (id, data) => {
    return PenjualanModel.query()
      .patchAndFetchById(id, data);
  }

  static deletePenjualan = (id) => {
    return PenjualanModel.query()
      .where("id", id)
      .delete();
  }
}

module.exports = PenjualanService;