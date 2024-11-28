"use strict";

const express = require("express");
const cors = require("cors");
const { Model } = require("objection");
const Knex = require("knex");
const path = require("path");
const indexRouter = require("./routes");
const { development } = require("./knexfile");

const knex = Knex(development);
const app = express();
Model.knex(knex);
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", indexRouter);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const PORT = process.env.SERVER_PORT || 8081;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}...`)
})