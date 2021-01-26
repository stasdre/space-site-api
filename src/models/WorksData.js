import { DataTypes } from 'sequelize';

const WorksData = (sequelize) =>
  sequelize.define(
    'WorksData',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      meta_title: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      meta_desc: {
        type: DataTypes.TEXT,
        defaultValue: '',
      },
      h1: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: '',
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      url: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      prev_img: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      img: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: 'works_data',
      timestamps: true,
    }
  );

export default WorksData;
