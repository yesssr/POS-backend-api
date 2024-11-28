/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists("users", (table) => {
    table.increments("id").primary();
    table.integer("role_id").unsigned();
    table.string("username", 256).notNullable();
    table.string("password", 512).notNullable();
    table.string("phone", 15).notNullable();
    table.string("photo").notNullable();
    table.timestamps(true, true, false);
    table.foreign("role_id").references("roles.id")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
