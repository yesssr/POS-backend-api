/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists("products", (table) => {
    table.increments("id").primary();
    table.string("name", 256).notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.integer("stok", 11).notNullable();
    table.enum("category", ["makanan", "minuman", "snack", "paket"]).notNullable();
    table.string("photo").notNullable();
    table.timestamps(true, true, false);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("products");
};
