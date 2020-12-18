// Core
import debug from 'debug';

// Instruments
import { app } from './server';
import { getPort } from './utils';

// DB
import db from './models';

const PORT = getPort();
const dg = debug('server:main');

app.listen(PORT, async () => {
  dg(`Server API is up on port ${PORT}`);
  try {
    await db.sequelize.authenticate();
    db.sequelize.sync({ alter: true });
    dg(`Connection has been established successfully.`);
  } catch (error) {
    dg(`Unable to connect to the database: ${error}`);
  }
});
