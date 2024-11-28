const express = require("express");
const { errorHandler } = require("../middleware/error");
const { auth, login } = require("../middleware/auth");
const { userRoutes } = require("./users");
const { productRoutes } = require("./products");
const { pelangganRoutes } = require("./pelanggan");
const { penjualanRoutes } = require("./penjualan");
const { uploadImage } = require("../helpers/multer");
const { saveImageToCloud } = require("../utils/utils");

const router = express.Router();
router.post("/upload-image", uploadImage().single("file"), async (req, res, next) => {
  try {
    const image = req.file;
    const link = await saveImageToCloud(image.buffer);
    console.log(link);
    res.status(200).send({
      success: true,
      message: "upload success",
      data: link,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", login);
router.use(auth);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/pelanggan", pelangganRoutes);
router.use("/penjualan", penjualanRoutes);
router.use(errorHandler);
module.exports = router;