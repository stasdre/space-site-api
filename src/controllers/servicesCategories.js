import db from '../models';

const ServiceCategories = db.serviceCategories;
const ServiceCategoriesData = db.serviceCategoriesData;
const Langs = db.lang;

const getAll = async (req, res) => {
  const { lang } = req.params;

  const where = lang ? { code: lang } : { default: 1 };

  try {
    const categories = await ServiceCategories.findAll({
      attributes: ['id'],
    });

    const data = await ServiceCategoriesData.findAll({
      attributes: [['ServiceCategoryId', 'id'], 'name'],
      where: {
        ServiceCategoryId: categories.map((item) => item.id),
      },
      include: [
        {
          model: Langs,
          attributes: ['id'],
          where,
        },
      ],
      raw: true,
    });
    res.status(200).send({ data });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

export { getAll };
