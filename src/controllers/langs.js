import db from '../models';

const Lang = db.lang;

const getAll = async (req, res) => {
  try {
    const langs = await Lang.findAll({
      attributes: ['id', 'name', 'code', 'culture', 'default'],
      order: [['order', 'ASC']],
      where: {
        active: 1,
      },
    });

    res.status(200).send({ data: langs });
  } catch (error) {}
};

export { getAll };
