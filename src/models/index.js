import { Sequelize, DataTypes } from 'sequelize';
import dg from 'debug';
import User from './User';
import Token from './Token';

import { getDB } from '../utils';

const db = {};
const debug = dg('db');
const { DB_PORT, DB_HOST, DB_NAME, DB_USER, DB_PASS } = getDB();

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
});

db.sequelize = sequelize;
db.users = User(sequelize);
db.token = Token(sequelize);

db.users.hasMany(db.token, {
  onDelete: 'CASCADE',
});
db.token.belongsTo(db.users);

export default db;
