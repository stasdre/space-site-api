import { DataTypes } from 'sequelize';

const Lang = (sequelize) =>
  sequelize.define(
    'Lang',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { allowNull: false, type: DataTypes.STRING },
      code: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      culture: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      default: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      tableName: 'langs',
      timestamps: true,
    }
  );

export default Lang;
