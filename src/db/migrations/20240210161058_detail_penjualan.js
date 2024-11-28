/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists("detail_penjualan", (table) => {
    table.increments("id").primary();
    table.integer("penjualan_id", 11).unsigned();
    table.integer("product_id", 11).unsigned();
    table.integer("jumlah_product", 11).notNullable();
    table.decimal("subtotal", 10, 2).notNullable();
    table.timestamps(true, true, false);
    table.foreign("penjualan_id").references("penjualan.id")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
    table.foreign("product_id").references("products.id")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("detail_penjualan");
};
