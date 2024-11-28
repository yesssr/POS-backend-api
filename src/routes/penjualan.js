const express = require("express");
const penjualanControllers = require("../controllers/penjualan");
const { paginationQueryValidate, isAdmin } = require("../middleware/auth");

const router = express.Router();
router.post("/", penjualanControllers.createPenjualan);

/* 
============
ADMIN ROUTES
============
*/

router.use(isAdmin);
router.get("/", paginationQueryValidate, penjualanControllers.getPenjualans);
router.get("/:id", penjualanControllers.getDetailPenjualan);

exports.penjualanRoutes = router;