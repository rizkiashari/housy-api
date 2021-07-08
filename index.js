require("dotenv").config();
const express = require("express");
const router = require("./src/routes");
const bodyParser = require("body-parser");
const PORT = 4000;

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use("/api/v1", router);

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
