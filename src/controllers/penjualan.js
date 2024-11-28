"use strict";

const { formValidation } = require("../middleware/auth");
const { SendError } = require("../middleware/error");
const DetailPenjualanService = require("../services/detail_penjualan");
const PenjualanService = require("../services/penjualan");
const ProductService = require("../services/products");
const { sendResponse } = require("../utils/utils");

const definePenjualan = (data) => {
  const { tanggal_penjualan, total_harga, total_bayar, pelanggan_id, items } = data;
  const penjualan = {
    tanggal_penjualan: {
      value: tanggal_penjualan,
      minLength: 1,
    },
    total_harga: {
      value: total_harga,
      minLength: 1,
    },
    total_bayar: {
      value: total_bayar,
      minLength: 1,
    },
    pelanggan_id: {
      value: pelanggan_id,
      minLength: 1,
    },
    items: {
      value: items,
      minLength: 1,
    },
  };

  return penjualan;
}

const penjualanControllers = {
  getPenjualans: async (req, res, next) => {
    try {
      const { offset, limit, search, date } = req.query;
      const penjualans = await PenjualanService.getPenjualans(offset, limit, search ?? "", date);
      sendResponse(res, 200, "get penjualans", penjualans);
    } catch (error) {
      next(error);
    }
  },

  createPenjualan: async (req, res, next) => {
    try {
      let date = new Date().toLocaleDateString().split("/");
      let items = [];
      req.body.tanggal_penjualan = date[2] + "-" + date[0] + "-" + date[1];

      const data = definePenjualan(req.body);
      formValidation(data);
      if (data.total_bayar.value < data.total_harga.value) {
        throw new SendError("pembayaran kurang!.", 400);
      }

      req.body.kembalian = req.body.total_bayar - req.body.total_harga;
      let detailPenjualan = [];

      items = req.body.items;
      const handleOrder = await ProductService.handleOrder(items);

      await ProductService.updateBulkStok(handleOrder);

      delete req.body.items;
      const penjualan = await PenjualanService.createPenjualan(req.body);
      for (const item of items) {
        const createDetailPenjualan = await DetailPenjualanService.createDetailPenjualan({
          penjualan_id: penjualan.id,
          product_id: item.id,
          jumlah_product: item.qty,
          subtotal: item.price * item.qty,
        });
        detailPenjualan.push(createDetailPenjualan);
      }
      req.body.id = penjualan.id;

      sendResponse(res, 201, "order successfully!.", req.body)
    } catch (error) {
      next(error);
    }
  },

  getDetailPenjualan: async (req, res, next) => {
    try {
      const penjualan_id = req.params.id;
      const detailPenjualan = await DetailPenjualanService.getDetailPenjualanByPenjualanId(penjualan_id);
      sendResponse(res, 200, "get detail penjualan", detailPenjualan);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = penjualanControllers;