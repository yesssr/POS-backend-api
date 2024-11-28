const { formValidation } = require("../middleware/auth");
const { sendResponse } = require("../utils/utils")
const PelangganService = require("../services/pelanggan");

const definePelanggan = (data) => {
  const { name, address, phone } = data;
  const pelanggan = {
    name: {
      value: name,
      minLength: 1,
    },
    address: {
      value: address,
      minLength: 1,
    },
    phone: {
      value: phone,
      minLength: 11,
      maxLength: 15,
    },
  };

  return pelanggan;
}

const pelangganControllers = {
  getPelanggans: async (req, res, next) => {
    try {
      const { offset, limit, search } = req.query;
      const pelanggans = await PelangganService.getPelanggans(offset, limit, search ?? "");
      sendResponse(res, 200, "get pelanggans", pelanggans);
    } catch (error) {
      next(error);
    }
  },

  createPelanggan: async (req, res, next) => {
    try {
      const data = definePelanggan(req.body)
      formValidation(data);
      const pelanggan = await PelangganService.createPelanggan(req.body);
      sendResponse(res, 201, "successfully created pelanggan!.", pelanggan);
    } catch (error) {
      next(error);
    }
  },

  updatePelanggan: async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = definePelanggan(req.body)
      formValidation(data);
      const pelanggan = await PelangganService.updatePelanggan(id, req.body);
      sendResponse(res, 200, "successfully updated pelanggan!.", pelanggan);
    } catch (error) {
      next(error);
    }
  },

  deletePelanggan: async (req, res, next) => {
    try {
      const id = req.params.id;
      const pelanggan = await PelangganService.deletePelanggan(id);
      sendResponse(res, 200, "successfully deleted pelanggan!.", pelanggan);
    } catch (error) {
      next(error);
    }
  },
}

module.exports = pelangganControllers;