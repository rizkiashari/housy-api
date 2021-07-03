"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class House extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      House.belongsTo(models.City, {
        as: "city",
        foreignKey: {
          name: "cityId",
        },
      });
    }
  }
  House.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      price: DataTypes.INTEGER,
      typeRent: DataTypes.STRING,
      Ameneties: DataTypes.STRING,
      bedRoom: DataTypes.INTEGER,
      bathroom: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "House",
      tableName: "houses",
    }
  );
  return House;
};
