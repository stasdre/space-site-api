import { DataTypes } from 'sequelize';

const Token = (sequelize) =>
  sequelize.define(
    'Token',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      refreshToken: DataTypes.STRING,
      ua: DataTypes.STRING,
      ip: DataTypes.STRING,
      expires: DataTypes.DATE,
    },
    {
      tableName: 'tokens',
      timestamps: true,
    }
  );

export default Token;
