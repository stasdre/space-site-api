import { DataTypes } from 'sequelize';

const ServicesWorks = (sequelize) =>
  sequelize.define(
    'ServicesWorks',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      tableName: 'service_works',
      timestamps: true,
    }
  );

export default ServicesWorks;
