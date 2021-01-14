import { Sequelize } from 'sequelize';
import dg from 'debug';
import User from './User';
import Token from './Token';
import WorkTypes from './WorkTypes';
import Work from './Work';
import WorksData from './WorksData';
import Service from './Service';
import Lang from './Lang';
import ServicesData from './ServicesData';
import ServicePrices from './ServicesPrices';
import ServicesWorks from './ServicesWorks';
import ServiceCategories from './ServiceCategories';
import ServiceCategoriesData from './ServiceCategoriesData';

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
db.worksData = WorksData(sequelize);
db.service = Service(sequelize);
db.servicesData = ServicesData(sequelize);
db.lang = Lang(sequelize);
db.servicePrices = ServicePrices(sequelize);
db.servicesWorks = ServicesWorks(sequelize);
db.serviceCategories = ServiceCategories(sequelize);
db.serviceCategoriesData = ServiceCategoriesData(sequelize);

db.users.hasMany(db.token, {
  onDelete: 'CASCADE',
});
db.token.belongsTo(db.users);

db.workTypes.hasMany(db.work, {
  onDelete: 'SET NULL',
});
db.work.belongsTo(db.workTypes);

db.work.hasMany(db.worksData, {
  onDelete: 'CASCADE',
});
db.worksData.belongsTo(db.work);

db.lang.hasMany(db.worksData, {
  onDelete: 'CASCADE',
});
db.worksData.belongsTo(db.lang);

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

db.service.hasMany(db.servicesWorks, {
  onDelete: 'CASCADE',
});
db.servicesWorks.belongsTo(db.service);

db.lang.hasMany(db.servicesWorks, {
  onDelete: 'CASCADE',
});
db.servicesWorks.belongsTo(db.lang);

db.work.hasMany(db.servicesWorks, {
  onDelete: 'CASCADE',
});
db.servicesWorks.belongsTo(db.work);

db.serviceCategories.hasMany(db.service, {
  onDelete: 'CASCADE',
});
db.service.belongsTo(db.serviceCategories);

db.serviceCategories.hasMany(db.serviceCategoriesData, {
  onDelete: 'CASCADE',
});
db.serviceCategoriesData.belongsTo(db.serviceCategories);

db.lang.hasMany(db.serviceCategoriesData, {
  onDelete: 'CASCADE',
});
db.serviceCategoriesData.belongsTo(db.lang);

export default db;
