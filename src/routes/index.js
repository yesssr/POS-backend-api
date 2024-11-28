const express = require("express");
const { errorHandler } = require("../middleware/error");
const { auth, login } = require("../middleware/auth");
const { userRoutes } = require("./users");
const { productRoutes } = require("./products");
const { pelangganRoutes } = require("./pelanggan");
const { penjualanRoutes } = require("./penjualan");

const router = express.Router();
router.post("/login", login);
router.use(auth);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/pelanggan", pelangganRoutes);
router.use("/penjualan", penjualanRoutes);
router.use(errorHandler);
module.exports = router;