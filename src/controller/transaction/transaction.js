const { transaction, House, City, User, Roll } = require("../../../models");

// Add Transaction
exports.addTransaction = async (req, res) => {
  const path = process.env.PATH_FILE;
  let transaksi = req.body;
  const attachment = req.files.imageFile[0].filename;

  try {
    transaksi = {
      ...transaksi,
      attachment,
    };

    if (!req.body.houseId) {
      return res.status(500).send({
        status: "Failed",
        message: "Transaction invalid, Not Found House",
      });
    }
    if (req.body.userId != req.idUser) {
      return res.status(500).send({
        status: "Failed",
        message: `Transaction invalid, Transaction important User ${req.idUser}`,
      });
    }
    const userData = await User.findOne({
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
        exclude: ["listId", "createdAt", "updatedAt", "password", "image"],
      },
    });

    let trxCreate = await transaction.create({
      ...transaksi,
    });

    let dataTransaksi = await transaction.findOne({
      where: {
        id: trxCreate.id,
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
        exclude: ["createdAt", "updatedAt", "houseId", "userId"],
      },
    });

    dataTransaksi = JSON.parse(JSON.stringify(dataTransaksi));
    console.log("Data Transaksi", dataTransaksi);
    dataTransaksi = {
      ...dataTransaksi,
      attachment: path + attachment,
      house: {
        ...dataTransaksi.house,
        Ameneties: dataTransaksi.house.Ameneties.split(","),
      },
    };

    res.status(200).send({
      status: "Success",
      message: "resource has successfully Add Transaction",
      data: { dataTransaksi, userData },
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

    dataTransaction = {
      ...dataTransaction,
      houseId: req.body.houseId,
    };

    console.log("req body", req.body);

    console.log("data Transaksi", dataTransaction);

    if (!dataTransaction.houseId) {
      return res.status(500).send({
        status: "Failed",
        message: `Transaction invalid, Not Found House ${req.body.houseId}`,
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
          exclude: ["createdAt", "updatedAt", "cityId", "image"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "houseId"],
      },
    });
    transactionOne = JSON.parse(JSON.stringify(transactionOne));
    transactionOne = {
      ...transactionOne,
      house: {
        ...transactionOne.house,
        Ameneties: transactionOne.house.Ameneties.split(","),
      },
      attachment: transactionOne.attachment
        ? path + transactionOne.attachment
        : null,
    };

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
          Ameneties: trx.house.Ameneties.split(","),
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
