const { House, City, User, Roll } = require("../../../models");
const { Op } = require("sequelize");

// Get All Houses
exports.getHouses = async (req, res) => {
  const path = process.env.PATH_FILE_HOUSE;

  try {
    let filters = { ...req.query };
    let objFilter = {};
    if (filters.typeRent != null) {
      objFilter.typeRent = {
        [Op.eq]: filters.typeRent,
      };
    }
    if (filters.belowPrice != null) {
      objFilter.price = {
        [Op.lte]: parseInt(filters.belowPrice),
      };
    }
    if (filters.bedRoom != null) {
      objFilter.bedRoom = {
        [Op.eq]: parseInt(filters.bedRoom),
      };
    }
    if (filters.bathroom != null) {
      objFilter.bathroom = {
        [Op.eq]: parseInt(filters.bathroom),
      };
    }

    console.log("objeck Filter ", objFilter);

    let houseData = await House.findAll({
      where: objFilter,

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
    houseData = JSON.parse(JSON.stringify(houseData));
    houseData = houseData.map((house) => {
      return {
        id: house.id,
        name: house.name,
        city: {
          id: house.city.id,
          name: house.city.name,
        },
        address: house.address,
        price: house.price,
        image: house.image ? path + house.image : null,
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
        house: houseData,
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
  const path = process.env.PATH_FILE_HOUSE;
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
        image: houseOne.image ? path + houseOne.image : null,
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
    const userValidasi = await User.findOne({
      where: {
        id: req.idUser,
      },
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

    console.log("list As", userValidasi.listAs.name);

    if (userValidasi.listAs.name === "owner") {
      const path = process.env.PATH_FILE_HOUSE;
      const house = req.body;
      const houseOne = await House.create({
        ...house,
        cityId: req.body.cityId,
        image: req.files.imageFile[0].filename,
        detail_one: req.files.detail_one[0].filename,
        detail_two: req.files.detail_two[0].filename,
        detail_three: req.files.detail_three[0].filename,
      });

      let dataHouse = await House.findOne({
        where: {
          name: houseOne.name,
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
      dataHouse = JSON.parse(JSON.stringify(dataHouse));
      res.status(200).send({
        status: "Success",
        message: "add house berhasil",
        data: {
          name: dataHouse.name,
          city: {
            id: dataHouse.city.id,
            name: dataHouse.city.name,
          },
          address: dataHouse.address,
          price: dataHouse.price,
          image: dataHouse.image ? path + dataHouse.image : null,
          detail_one: path + dataHouse.detail_one,
          detail_two: path + dataHouse.detail_two,
          detail_three: path + dataHouse.detail_three,
          typeRent: dataHouse.typeRent,
          description: dataHouse.description,
          area: dataHouse.area,
          Ameneties: dataHouse.Ameneties.split(","),
          bedRoom: dataHouse.bedRoom,
          bathroom: dataHouse.bathroom,
        },
      });
    } else {
      res.status(500).send({
        status: "failed",
        message: `gagal add House, kamu ${userValidasi.listAs.name}`,
      });
    }
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
    const userValidasi = await User.findOne({
      where: {
        id: req.idUser,
      },
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

    if (userValidasi.listAs.name === "owner") {
      const { id } = req.params;
      const path = process.env.PATH_FILE_HOUSE;

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
        message: "Update Success",
        data: {
          id,
          name: houseOne.name,
          city: {
            id: houseOne.city.id,
            name: houseOne.city.name,
          },
          address: houseOne.address,
          image: houseOne.image ? path + houseOne.image : null,
          price: houseOne.price,
          typeRent: houseOne.typeRent,
          Ameneties: houseOne.Ameneties.split(","),
          bedRoom: houseOne.bedRoom,
          bathroom: houseOne.bathroom,
        },
      });
    } else {
      res.status(500).send({
        status: "failed",
        message: `gagal add House, kamu ${userValidasi.listAs.name}`,
      });
    }
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
    const userValidasi = await User.findOne({
      where: {
        id: req.idUser,
      },
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
    if (userValidasi.listAs.name === "owner") {
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
    } else {
      res.status(500).send({
        status: "failed",
        message: `gagal add House, kamu ${userValidasi.listAs.name}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Delete not found",
    });
  }
};
