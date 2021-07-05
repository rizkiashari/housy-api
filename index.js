require("dotenv").config();
const express = require("express");
const router = require("./src/routes");
const PORT = 3000;

const app = express();

app.use(express.json());
app.use("/api/v1", router);

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
