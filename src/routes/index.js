const { Router } = require("express");
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
const { auth, authHouse } = require("../middleware/auth");

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
router.put("/user/:id", updateUser);

// 2. Houses
// Get House
router.get("/houses", getHouses);
// Get Detail House
router.get("/house/:id", getHouse);
// Add House
router.post("/house", auth, addHouse);
// Edit House
router.patch("/house/:id", auth, editHouse);
// Delete House
router.delete("/house/:id", auth, deleteHouse);

module.exports = router;
