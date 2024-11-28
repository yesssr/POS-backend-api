const express = require("express");
const pelangganControllers = require("../controllers/pelanggan");
const { paginationQueryValidate, isAdmin } = require("../middleware/auth");

const router = express.Router();
router.get("/", paginationQueryValidate, pelangganControllers.getPelanggans);
router.post("/", pelangganControllers.createPelanggan);

/* 
============
ADMIN ROUTES
============
*/

router.use(isAdmin);
router
  .route("/:id")
  .put(pelangganControllers.updatePelanggan)
  .delete(pelangganControllers.deletePelanggan);

exports.pelangganRoutes = router;