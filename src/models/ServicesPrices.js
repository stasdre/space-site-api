import { DataTypes } from 'sequelize';

const ServicePrices = (sequelize) =>
  sequelize.define(
    'ServicePrices',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      price: {
        type: DataTypes.FLOAT,
      },
      from: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      promo: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      column: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
    },
    {
      tableName: 'service_prices',
      timestamps: true,
    }
  );

export default ServicePrices;
