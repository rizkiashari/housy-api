const { User, Roll } = require("../../../models");
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getUsers = async (req, res) => {
  //console.log("Oke saya", User);
  // const { id } = req.body;
  try {
    const users = await User.findAll({
      include: {
        model: Roll,
        as: "listAs",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "address", "password", "listId"],
      },
    });
    res.status(200).send({
      status: "Success",
      message: "resource has successfully get",
      data: {
        users,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

exports.getUser = async (req, res) => {
  //console.log("Oke saya user", User);
  try {
    const userOne = await User.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "address"],
      },
    });
    res.status(200).send({
      status: "Success",
      message: "Get User with id",
      data: userOne,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "User id not found",
    });
  }
};

// Sign Up
exports.createUser = async (req, res) => {
  //console.log("Oke saya user", User);
  try {
    // Email
    const { email, password } = req.body;
    const userData = req.body;

    const schema = joi.object({
      fullName: joi.string().min(3).required(),
      username: joi.string().min(3).required(),
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
      listAsId: joi.number().min(1).required(),
      gender: joi.string().required(),
      address: joi.string().required(),
    });

    const { error } = schema.validate(userData);

    if (error) {
      return res.status(500).send({
        status: "failed",
        message: error.details[0].message,
      });
    }

    // Check Email
    const checkEmail = await User.findOne({
      where: {
        email,
      },
    });
    if (checkEmail) {
      return res.status(500).send({
        status: "failed",
        message: "Email Already Registered",
      });
    }

    // bcrypt Password
    const hashStrenght = 10;
    const hashedPassword = await bcrypt.hash(password, hashStrenght);

    const dataUser = await User.create({
      ...userData,
      listId: req.body.listAsId,
      password: hashedPassword,
    });
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(
      {
        id: userData.id,
      },
      secretKey
    );

    res.status(200).send({
      status: "Success",
      message: "resource succesfully create user",
      data: {
        username: dataUser.username,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Sign Up Invalid",
    });
  }
};

// Sign In
exports.login = async (req, res) => {
  //console.log("Oke saya", User);
  try {
    const { username, password } = req.body;
    const userData = req.body;

    const schema = joi.object({
      username: joi.string().min(3).required(),
      password: joi.string().min(8).required(),
    });

    const { error } = schema.validate(userData);

    if (error) {
      return res.status(500).send({
        status: "failed",
        message: error.details[0].message,
      });
    }

    // Check username
    const checkValidation = await User.findOne({
      where: {
        username,
      },
    });
    if (!checkValidation) {
      return res.status(500).send({
        status: "failed",
        message: "Username Or Password don't match",
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      checkValidation.password
    );
    if (!isValidPassword) {
      return res.status(500).send({
        status: "failed",
        message: "Username Or Password don't match",
      });
    }

    const secretKey = "iniRahasiabanget";
    const token = jwt.sign(
      {
        id: checkValidation.id,
      },
      secretKey
    );

    res.status(200).send({
      status: "Success",
      message: "resource succesfully sign In",
      data: {
        username: checkValidation.username,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Sign In Invalid",
    });
  }
};

exports.updateUser = async (req, res) => {
  //console.log("Oke saya user", User);
  const { id } = req.params;
  try {
    await User.update(req.body, {
      where: {
        id: id,
      },
    });
    const user = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(200).send({
      status: "Success",
      message: "resource has successfully updated user",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Update not found",
    });
  }
};

// Delete
exports.deleteUser = async (req, res) => {
  //console.log("Oke saya user", User);
  const { id } = req.params;
  try {
    const user = await User.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).send({
      status: "Success",
      message: "resource has successfully deleted user",
      data: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Delete not found",
    });
  }
};
