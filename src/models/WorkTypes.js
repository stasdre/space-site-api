import { DataTypes } from 'sequelize';

const WorkTypes = (sequelize) =>
  sequelize.define(
    'WorkTypes',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
    },
    {
      tableName: 'work_types',
      timestamps: true,
    }
  );

export default WorkTypes;
