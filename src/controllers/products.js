const path = require("path");
const { formValidation } = require("../middleware/auth");
const { sendResponse, saveImage, deleteImage, getUniqNumber, saveImageToCloud } = require("../utils/utils");
const ProductService = require("../services/products");
const { SendError } = require("../middleware/error");

const imageDir = path.join(
  __dirname,
  "../../uploads/products/"
);

const defineProduct = (data) => {
  const { name, price, stok, category, photo } = data;
  const product = {
    name: {
      value: name,
      minLength: 1,
    },
    price: {
      value: price,
      minLength: 1,
    },
    stok: {
      value: stok,
      minLength: 1,
    },
    category: {
      value: category,
      minLength: 1,
    },
    photo: {
      value: photo,
    },
  }

  return product;
};

const productControllers = {
  getProducts: async (req, res, next) => {
    try {
      const { offset, limit, search, category } = req.query;
      const products = await ProductService.getProducts(offset, limit, search ?? "", category);
      sendResponse(res, 200, "get products", products);
    } catch (error) {
      next(error);
    }
  },

  createProduct: async (req, res, next) => {
    try {
      const image = req.file;
      req.body.photo = image?.originalname;
      const data = defineProduct(req.body);
      formValidation(data);
      const price = parseInt(req.body.price), stok = parseInt(req.body.stok);
      req.body.price = price;
      req.body.stok = stok;

      const filename = getUniqNumber() + "-" + req.body.name.split(" ").join("-") + "-" + image?.originalname;
      const file = imageDir + filename;

      // await saveImage(file, image?.buffer);
      const link = await saveImageToCloud(image?.buffer);
      req.body.photo = link;

      const product = await ProductService.createProduct(req.body);
      sendResponse(res, 201, "successfully created product!.", product);
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const id = req.params.id;
      const image = req.file;
      const data = defineProduct(req.body);
      formValidation(data);
      const price = parseInt(req.body.price), stok = parseInt(req.body.stok);
      req.body.price = price;
      req.body.stok = stok;

      if (image) {
        // const delFile = imageDir + req.body.photo;
        // await deleteImage(delFile);
        // const filename = getUniqNumber() + "-" + req.body.name.split(" ").join("-") + "-" + image?.originalname;
        // const file = imageDir + filename;
        const link = await saveImageToCloud(image?.buffer);
        req.body.photo = link;
      }

      const product = await ProductService.updateProduct(id, req.body);
      sendResponse(res, 200, "successfully updated product!.", product);
    } catch (error) {
      next(error);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const id = req.params.id;
      const product = await ProductService.getById(id);

      if (!product) throw new SendError("data not found!.", 404);

      const deleteProduct = await ProductService.deleteProduct(id);
      // const delFile = imageDir + product.photo;
      // await deleteImage(delFile);

      sendResponse(res, 200, "sucessfully deleted product!.", deleteProduct > 0 ? product : deleteProduct);
    } catch (error) {
      next(error);
    }
  },

  updateStokProduct: async (req, res, next) => {
    try {
      const id = req.params.id;
      const stok = parseInt(req.body.stok);

      if (!stok) throw new SendError("stok is required!.", 400);
      if (isNaN(parseInt(stok))) throw new SendError(key + " " + "must be a number", 400);

      const product = await ProductService.updateProduct(id, { stok: stok });
      sendResponse(res, 200, "succesfully updated stok product!.", product);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = productControllers;