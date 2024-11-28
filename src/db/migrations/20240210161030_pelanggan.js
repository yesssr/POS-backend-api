/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists("pelanggan", (table) => {
    table.increments("id").primary();
    table.string("name", 256).notNullable();
    table.text("address").notNullable();
    table.string("phone", 15).notNullable();
    table.timestamps(true, true, false);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema.dropTable("pelanggan");
};
