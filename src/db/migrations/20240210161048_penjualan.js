/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists("penjualan", (table) => {
    table.increments("id").primary();
    table.date("tanggal_penjualan").notNullable();
    table.decimal("total_harga", 10, 2).notNullable();
    table.decimal("total_bayar", 10, 2).notNullable();
    table.decimal("kembalian", 10, 2).notNullable();
    table.integer("pelanggan_id", 11).unsigned();
    table.timestamps(true, true, false);
    table.foreign("pelanggan_id").references("pelanggan.id")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("penjualan");
};
