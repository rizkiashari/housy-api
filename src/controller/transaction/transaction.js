const { transaction, House, City, User, Roll } = require("../../../models");

// Add Transaction
exports.addTransaction = async (req, res) => {
  try {
    const transaksi = req.body;
    const path = process.env.PATH_FILE_TRANSACTION;
    const trxData = await transaction.create({
      ...transaksi,
      userId: req.idUser,
      //attachment: req.files.attachment[0].filename,
    });

    let storedTrx = await transaction.findOne({
      where: {
        id: trxData.id,
      },
      include: [
        {
          model: House,
          as: "house",
          include: [
            {
              model: City,
              as: "city",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "cityId"],
          },
        },
        {
          model: User,
          as: "user",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "gender",
              "address",
              "listId",
            ],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "houseId", "userId"],
      },
    });
    storedTrx = JSON.parse(JSON.stringify(storedTrx));
    res.status(200).send({
      status: "Success",
      message: "add transaksi berhasil",
      data: {
        checkin: storedTrx.checkin,
        checkout: storedTrx.checkout,
        house: {
          name: storedTrx.house.name,
          city: {
            id: storedTrx.house.city.id,
            name: storedTrx.house.city.name,
          },
          address: storedTrx.house.address,
          price: storedTrx.house.price,
          typeRent: storedTrx.house.typeRent,
          Ameneties: storedTrx.house.Ameneties.split(","),
          bedRoom: storedTrx.house.bedRoom,
          bathroom: storedTrx.house.bathroom,
        },
        total: storedTrx.total,
        status: storedTrx.status,
        attachment: storedTrx.attachment ? path + storedTrx.attachment : null,
        user: {
          fullName: storedTrx.user.fullName,
        },
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
    const path = process.env.PATH_FILE_TRANSACTION;
    const { id } = req.params;
    let dataTransaction = req.body;

    dataTransaction = {
      ...dataTransaction,
      houseId: req.body.houseId,
      attachment: req.files.attachment[0].filename,
    };

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
    const path = process.env.PATH_FILE_TRANSACTION;
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
      message: `resource has successfully Get Transaction ${transactionOne.id}`,
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
        attachment: transactionOne.attachment
          ? path + transactionOne.attachment
          : null,
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
    const path = process.env.PATH_FILE_TRANSACTION;
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
        attachment: trx.attachment ? path + trx.attachment : null,
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
