import { async } from 'crypto-random-string';
import db from '../models';

const ServiceCategories = db.serviceCategories;
const ServiceCategoriesData = db.serviceCategoriesData;
const Langs = db.lang;
const Service = db.service;
const ServicesData = db.servicesData;

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

const getAllWidthServices = async (req, res) => {
  const { lang } = req.params;
  const dataCategories = [];
  try {
    const categories = await ServiceCategories.findAll({
      attributes: ['id'],
    });

    const data = await ServiceCategoriesData.findAll({
      attributes: [['ServiceCategoryId', 'id'], 'name'],
      where: {
        ServiceCategoryId: categories.map((item) => item.id),
      },
      order: [['order', 'ASC']],
      include: [
        {
          model: Langs,
          attributes: ['id'],
          where: { code: lang },
        },
      ],
      raw: true,
    });

    for (const item of data) {
      const dataServices = await ServicesData.findAll({
        attributes: ['name', 'url'],
        order: [['order', 'ASC']],
        include: [
          {
            model: Service,
            attributes: ['id'],
            where: {
              active: 1,
              ServiceCategoryId: item.id,
            },
          },
          {
            model: Langs,
            attributes: ['id'],
            where: { code: lang },
          },
        ],
        raw: true,
      });

      dataCategories.push({ ...item, services: dataServices.map((item) => item) });
    }

    res.status(200).send({ data: dataCategories });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

export { getAll, getAllWidthServices };
