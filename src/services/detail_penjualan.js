"use strict";

const DetailPenjualanModel = require("../models/detail_penjualan");

class DetailPenjualanService {
  static getDetailPenjualanByPenjualanId = (penjualan_id) => {
    return DetailPenjualanModel.query()
      .select(
        "detail_penjualan.id",
        "detail_penjualan.penjualan_id",
        "detail_penjualan.product_id",
        "detail_penjualan.jumlah_product",
        "detail_penjualan.subtotal",
        "products.name as product_name",
        "products.price",
        "detail_penjualan.created_at",
        "detail_penjualan.updated_at",
      )
      .joinRelated("products")
      .where("detail_penjualan.penjualan_id", penjualan_id)
  }

  static createDetailPenjualan = (data) => {
    return DetailPenjualanModel.query()
      .insert(data);
  }

  static updateDetailPenjualan = (id, data) => {
    return DetailPenjualanModel.query()
      .patchAndFetchById(id, data);
  }

  static deleteDetailPenjualan = (id) => {
    return DetailPenjualanModel.query()
      .where("id", id)
      .delete();
  }
}

module.exports = DetailPenjualanService;