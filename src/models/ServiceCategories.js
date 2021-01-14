import { DataTypes } from 'sequelize';

const ServiceCategories = (sequelize) =>
  sequelize.define(
    'ServiceCategories',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      tableName: 'service_categories',
      timestamps: true,
    }
  );

export default ServiceCategories;
