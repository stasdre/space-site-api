import { DataTypes } from 'sequelize';

const ServiceData = (sequelize) =>
  sequelize.define(
    'ServiceData',
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
      h2: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      video_name: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      video_prev: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      video_url: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: '',
      },
      main_title: {
        type: DataTypes.STRING,
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
      desc_hash: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      desc: {
        type: DataTypes.TEXT,
        defaultValue: '',
      },
      price_hash: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      more_hash: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      more: {
        type: DataTypes.TEXT('long'),
        defaultValue: '',
      },
    },
    {
      tableName: 'services_data',
      timestamps: true,
    }
  );

export default ServiceData;
