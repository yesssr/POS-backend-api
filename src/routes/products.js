const express = require("express");
const productControllers = require("../controllers/products");
const { uploadImage } = require("../helpers/multer");
const { paginationQueryValidate, isAdmin } = require("../middleware/auth");

const router = express.Router();
router.get("/", paginationQueryValidate, productControllers.getProducts);
router.put("/update-stock/:id", productControllers.updateStokProduct);

/* 
============
ADMIN ROUTES
============
*/

router.use(isAdmin);
router.post("/", uploadImage().single("file"), productControllers.createProduct);
router
  .route("/:id")
  .put(uploadImage().single("file"), productControllers.updateProduct)
  .delete(productControllers.deleteProduct);

exports.productRoutes = router;