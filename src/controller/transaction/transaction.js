const { transaction, House, City } = require("../../../models");

// Add Transaction
exports.addTransaction = async (req, res) => {
  try {
    const path = process.env.PATH_FILE;
    let transaksi = req.body;
    const attachment = req.files.imageFile[0].filename;

    if (!req.body.houseId) {
      return res.status(500).send({
        status: "Failed",
        message: "Transaction invalid, Not Found House",
      });
    }

    const dataTransaksi = await transaction.create({
      ...transaksi,
      houseId: req.body.houseId,
    });

    const transactionOne = await transaction.findOne({
      where: {
        id: dataTransaksi.id,
      },
      include: {
        model: House,
        as: "house",
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
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "houseId"],
      },
    });

    res.status(200).send({
      status: "Success",
      message: "resource has successfully Add Transaction",
      data: {
        id: transactionOne.id,
        checkin: transactionOne.checkin,
        checkout: transactionOne.checkout,
        house: {
          id: transactionOne.house.id,
          name: transactionOne.house.name,
          city: {
            id: transactionOne.house.city.id,
            name: transactionOne.house.city.name,
          },
          address: transactionOne.house.address,
          price: transactionOne.house.price,
          typeRent: transactionOne.house.typeRent,
          Ameneties: transactionOne.house.Ameneties.split(","),
          bedRoom: transactionOne.house.bedRoom,
          bathroom: transactionOne.house.bathroom,
        },
        total: transactionOne.total,
        status: transactionOne.status,
        attachment: transactionOne.attachment,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Transaction add invalid",
    });
  }
};

// Edit Transaction
exports.editTransaction = async (req, res) => {
  try {
    const path = process.env.PATH_FILE;
    const { id } = req.params;

    let dataTransaction = req.body;
    const attachment = req.files.imageFile[0].filename;

    dataTransaction = {
      ...dataTransaction,
      attachment,
      houseId: req.body.houseId,
    };

    if (!req.body.houseId) {
      return res.status(500).send({
        status: "Failed",
        message: "Transaction invalid, Not Found House",
      });
    }
    await transaction.update(dataTransaction, {
      where: {
        id,
      },
    });

    let transactionOne = await transaction.findOne({
      where: {
        id,
      },
      include: {
        model: House,
        as: "house",
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
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "houseId"],
      },
    });

    res.status(200).send({
      status: "Success",
      message: `Transaction Data ID ${req.params.id} Updated`,
      data: transactionOne,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Update not found",
    });
  }
};

// Get Transaction with Id
exports.getTransaction = async (req, res) => {
  try {
    const transactionOne = await transaction.findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: House,
        as: "house",
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
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "houseId"],
      },
    });

    res.status(200).send({
      status: "Success",
      message: "resource has successfully Add Transaction",
      data: {
        id: transactionOne.id,
        checkin: transactionOne.checkin,
        checkout: transactionOne.checkout,
        house: {
          id: transactionOne.house.id,
          name: transactionOne.house.name,
          city: {
            id: transactionOne.house.city.id,
            name: transactionOne.house.city.name,
          },
          address: transactionOne.house.address,
          price: transactionOne.house.price,
          typeRent: transactionOne.house.typeRent,
          Ameneties: transactionOne.house.Ameneties.split(","),
          bedRoom: transactionOne.house.bedRoom,
          bathroom: transactionOne.house.bathroom,
        },
        total: transactionOne.total,
        status: transactionOne.status,
        attachment: transactionOne.attachment,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: `transaction ${req.params.id} not found`,
    });
  }
};

// Get Transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await transaction.findAll({
      include: {
        model: House,
        as: "house",
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
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "houseId"],
      },
    });
    const transactionData = transactions.map((trx) => {
      return {
        id: trx.id,
        checkin: trx.checkin,
        checkout: trx.checkout,
        house: {
          id: trx.house.id,
          name: trx.house.name,
          city: {
            id: trx.house.city.id,
            name: trx.house.city.name,
          },
          address: trx.house.address,
          price: trx.house.price,
          typeRent: trx.house.typeRent,
          Ameneties: trx.house.Ameneties,
          bedRoom: trx.house.bedRoom,
          bathroom: trx.house.bathroom,
        },
        total: trx.total,
        status: trx.status,
        attachment: trx.attachment,
      };
    });
    res.status(200).send({
      status: "Success",
      message: "resource has successfully get",
      data: {
        transactionData,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: `transaction not found`,
    });
  }
};
