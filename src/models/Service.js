import { DataTypes } from 'sequelize';

const Service = (sequelize) =>
  sequelize.define(
    'Service',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { allowNull: false, type: DataTypes.STRING },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      tableName: 'services',
      timestamps: true,
    }
  );

export default Service;
