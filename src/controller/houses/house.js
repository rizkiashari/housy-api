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
    const houseOne = await House.findOne({
      where: {
        id: dataHouse.id,
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
      message: "resource has successfully Add House",
      data: {
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
      message: "house add invalid",
    });
  }
};

// Edit House
exports.editHouse = async (req, res) => {
  try {
    const { id } = req.params;
    //let dataHouse = req.body;

    await House.update(req.body, {
      where: {
        id,
      },
    });

    const houseOne = await House.findOne({
      where: {
        id,
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
      message: "Update Succes",
      data: {
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
      message: "Update not found",
    });
  }
};

// Delete House
exports.deleteHouse = async (req, res) => {
  try {
    const { id } = req.params;

    const dataHouse = await House.destroy({
      where: {
        id,
      },
    });
    res.status(200).send({
      status: "Success",
      message: "resource has successfully deleted House",
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
