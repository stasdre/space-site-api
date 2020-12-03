import { DataTypes } from 'sequelize';

const Work = (sequelize) =>
  sequelize.define(
    'Work',
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
      tableName: 'works',
      timestamps: true,
    }
  );

export default Work;
