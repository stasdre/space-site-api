import { Sequelize } from 'sequelize';
import dg from 'debug';
import User from './User';
import Token from './Token';
import WorkTypes from './WorkTypes';
import Work from './Work';
import Service from './Service';
import Lang from './Lang';
import ServicesData from './ServicesData';
import ServicePrices from './ServicesPrices';

import { getDB } from '../utils';

const db = {};
const debug = dg('db');
const { DB_PORT, DB_HOST, DB_NAME, DB_USER, DB_PASS } = getDB();

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mariadb',
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  },
});

db.sequelize = sequelize;
db.users = User(sequelize);
db.token = Token(sequelize);
db.workTypes = WorkTypes(sequelize);
db.work = Work(sequelize);
db.service = Service(sequelize);
db.servicesData = ServicesData(sequelize);
db.lang = Lang(sequelize);
db.servicePrices = ServicePrices(sequelize);

db.users.hasMany(db.token, {
  onDelete: 'CASCADE',
});
db.token.belongsTo(db.users);

db.workTypes.hasMany(db.work, {
  onDelete: 'SET NULL',
});
db.work.belongsTo(db.workTypes);

db.work.belongsToMany(db.service, {
  through: 'ServiceWorks',
});
db.service.belongsToMany(db.work, {
  through: 'ServiceWorks',
});

db.service.hasMany(db.servicesData, {
  onDelete: 'CASCADE',
});
db.servicesData.belongsTo(db.service);

db.lang.hasMany(db.servicesData, {
  onDelete: 'CASCADE',
});
db.servicesData.belongsTo(db.lang);

db.service.hasMany(db.servicePrices, {
  onDelete: 'CASCADE',
});
db.servicePrices.belongsTo(db.service);

db.lang.hasMany(db.servicePrices, {
  onDelete: 'CASCADE',
});
db.servicePrices.belongsTo(db.lang);

db.servicesData.hasMany(db.servicePrices, {
  onDelete: 'CASCADE',
});
db.servicePrices.belongsTo(db.servicesData);

export default db;
