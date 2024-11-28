"use strict";

const ProductModel = require("../models/products");
const { SendError } = require("../middleware/error");

class ProductService {
  static getProducts = async (offset, limit, search, category) => {
    let query = ProductModel.query()
      .select(
        "products.id",
        "products.name",
        "products.price",
        "products.stok",
        "products.category",
        "products.photo",
        "products.created_at",
        "products.updated_at",
      )
      .whereILike("products.name", "%" + search + "%")
      .offset(offset)
      .limit(limit)

    if (category && category === "new") {
      query.orderBy("id", "DESC");
    } else {
      query.orderBy("name", "ASC");
    }

    if (category && category !== "new") {
      query.andWhere("products.category", category)
    };

    return await query;
  }

  static getById = (id) => {
    return ProductModel.query()
      .select(
        "products.id",
        "products.name",
        "products.price",
        "products.stok",
        "products.category",
        "products.photo",
        "products.created_at",
        "products.updated_at",
      )
      .where("products.id", id)
      .first();
  }

  static createProduct = (data) => {
    return ProductModel.query()
      .insert(data);
  }

  static updateProduct = async (id, data) => {
    return ProductModel.query()
      .patchAndFetchById(id, data);
  }

  static deleteProduct = (id) => {
    return ProductModel.query()
      .where("id", id)
      .delete();
  }

  static checkStok = (product_id) => {
    return ProductModel.query()
      .select(
        "products.id",
        "products.name",
        "products.price",
        "products.stok",
      )
      .where("id", product_id)
      .andWhere("stok", ">", 0)
      .first();
  }

  static updateBulkStok = async (listProduct) => {
    let result = [];
    for (const product of listProduct) {
      let query = await ProductModel.query()
        .patchAndFetchById(product.id, product);

      result.push(query);
    }

    return result;
  }

  static handleOrder = async (items) => {
    return new Promise(async (resolve, rejects) => {
      const updateStokProduct = [];
      for (const item of items) {
        const checkStok = await ProductService.checkStok(item.id);
        if (!checkStok || checkStok.stok < item.qty) {
          rejects(new SendError(`stock for item ${item.title} not available`, 400));
        } else {
          updateStokProduct.push({
            id: item.id,
            stok: checkStok.stok - item.qty,
          })
        };
      }
      resolve(updateStokProduct);
    })
  }
}

module.exports = ProductService;