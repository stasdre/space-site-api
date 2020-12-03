import db from '../models';

const workTypes = db.workTypes;

const getAll = async (req, res) => {
  try {
    const typesData = await workTypes.findAll({
      attributes: ['id', 'name'],
    });
    res.status(200).send({ data: typesData });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

export { getAll };
