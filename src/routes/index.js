const { Router } = require("express");
const multer = require("multer");
const upload = multer();
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  login,
} = require("../controller/user/user");
const {
  getHouses,
  getHouse,
  addHouse,
  editHouse,
  deleteHouse,
} = require("../controller/houses/house");
const { auth } = require("../middleware/auth");
const {
  addTransaction,
  editTransaction,
  getTransaction,
  getTransactions,
} = require("../controller/transaction/transaction");
const { uploadFile } = require("../middleware/uploadFile");

const router = Router();

// EndPoint
// 1. User All
// Get User
router.get("/users", auth, getUsers);
// Get User by Id
router.get("/user/:id", auth, getUser);
// Sign In
router.post("/signin", login);
// SignUp
router.post("/signup", createUser);
// Delete
router.delete("/user/:id", deleteUser);
// Update
router.patch("/user/:id", auth, uploadFile("profileImage"), updateUser);

// 2. Houses
// Get House
router.get("/houses", getHouses);
// Get Detail House
router.get("/house/:id", getHouse);
// Add House
router.post(
  "/house",
  auth,
  uploadFile("imageFile", "detail_one", "detail_two", "detail_three"),
  addHouse
);
// Edit House
router.patch("/house/:id", auth, editHouse);
// Delete House
router.delete("/house/:id", auth, deleteHouse);

// 3. Transaction
// Add Transaction
router.post("/transaction", auth, upload.array(), addTransaction);
// Edit Transaction
router.patch("/order/:id", auth, uploadFile("attachment"), editTransaction);
// Get Transaction
router.get("/order/:id", getTransaction);
// Get All Transaction
router.get("/transactions", getTransactions);

module.exports = router;
