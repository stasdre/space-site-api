import { DataTypes } from 'sequelize';

const ServiceCategoriesData = (sequelize) =>
  sequelize.define(
    'ServiceCategoriesData',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
    },
    {
      tableName: 'service_categories_data',
      timestamps: true,
    }
  );

export default ServiceCategoriesData;
