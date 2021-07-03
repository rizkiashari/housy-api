const { House, City } = require("../../../models");
const jwt = require("jsonwebtoken");

// Get All Houses
exports.getHouses = async (req, res) => {
  console.log("Oke saya", House);
  try {
    const houses = await House.findAll({
      include: {
        model: City,
        as: "city",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "cityId"],
      },
    });

    const houseData = houses.map((house) => {
      return {
        id: house.id,
        name: house.name,
        city: {
          id: house.city.id,
          name: house.city.name,
        },
        address: house.address,
        price: house.price,
        typeRent: house.typeRent,
        Ameneties: house.Ameneties.split(","),
        bedRoom: house.bedRoom,
        bathroom: house.bathroom,
      };
    });
    res.status(200).send({
      status: "Success",
      message: "resource has successfully get",
      data: {
        houseData,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Get House not Found",
    });
  }
};

// Get Detail House with id
exports.getHouse = async (req, res) => {
  // console.log("Oke saya", House);
  try {
    const houseOne = await House.findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: City,
        as: "city",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "cityId"],
      },
    });

    res.status(200).send({
      status: "Success",
      message: "Get House with id",
      data: {
        id: houseOne.id,
        name: houseOne.name,
        city: {
          id: houseOne.city.id,
          name: houseOne.city.name,
        },
        address: houseOne.address,
        price: houseOne.price,
        typeRent: houseOne.typeRent,
        Ameneties: houseOne.Ameneties.split(","),
        bedRoom: houseOne.bedRoom,
        bathroom: houseOne.bathroom,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "house id not found",
    });
  }
};

// Add House
exports.addHouse = async (req, res) => {
  try {
    const house = req.body;
    const dataHouse = await House.create({
      ...house,
      cityId: req.body.cityId,
    });

    const secretKey = "iniRahasiabanget";
    const token = jwt.sign(
      {
        id: house.id,
      },
      secretKey
    );

    res.status(200).send({
      status: "Success",
      message: "resource has successfully Add House",
      data: {
        id: dataHouse.id,
        name: dataHouse.name,
        city: {
          id: dataHouse.city.id,
          name: dataHouse.city.name,
        },
        address: dataHouse.address,
        price: dataHouse.price,
        typeRent: dataHouse.typeRent,
        Ameneties: dataHouse.Ameneties.split(","),
        bedRoom: dataHouse.bedRoom,
        bathroom: dataHouse.bathroom,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "house add invalid",
    });
  }
};
