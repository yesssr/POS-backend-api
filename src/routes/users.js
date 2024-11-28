const express = require("express");
const userControllers = require("../controllers/users");
const { uploadImage } = require("../helpers/multer");
const { paginationQueryValidate, isAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/profile", userControllers.getProfile);

/* 
============
ADMIN ROUTES
============
*/

router.use(isAdmin);
router.get("/", paginationQueryValidate, userControllers.getUsers);
router.post("/", uploadImage().single("file"), userControllers.createUser);

router
  .route("/:id")
  .put(uploadImage().single("file"), userControllers.updateUser)
  .delete(userControllers.deleteUser);

exports.userRoutes = router;