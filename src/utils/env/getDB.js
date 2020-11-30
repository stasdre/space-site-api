export const getDB = () => {
  const DB_PORT = process.env.DB_PORT;
  const DB_HOST = process.env.DB_HOST;
  const DB_NAME = process.env.DB_NAME;
  const DB_USER = process.env.DB_USER;
  const DB_PASS = process.env.DB_PASS;

  return {
    DB_PORT,
    DB_HOST,
    DB_NAME,
    DB_USER,
    DB_PASS,
  };
};
