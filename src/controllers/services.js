import { async } from 'crypto-random-string';
import db from '../models';

const Service = db.service;
const ServicesData = db.servicesData;
const ServicePrices = db.servicePrices;
const ServicesWorks = db.servicesWorks;
const Works = db.work;
const WorksData = db.worksData;
const Langs = db.lang;
const WorkTypes = db.workTypes;
const ServiceCategoriesData = db.serviceCategoriesData;

const getByLang = async (req, res) => {
  const { lang } = req.params;
  const data = [];

  try {
    const services = await Service.findAll({
      attributes: ['id', 'active', 'ServiceCategoryId', 'createdAt', 'updatedAt'],
    });

    for (const item of services) {
      const servicesData = await ServicesData.findOne({
        attributes: ['name', 'createdAt', 'updatedAt'],
        where: {
          ServiceId: item.id,
          LangId: lang,
        },
      });

      const prices = await ServicePrices.findAll({
        attributes: [
          'id',
          'title',
          'price',
          'from',
          'column',
          'ServiceId',
          'LangId',
          'createdAt',
          'updatedAt',
        ],
        where: {
          ServiceId: item.id,
          LangId: lang,
        },
        order: [['column', 'ASC']],
      });

      const dataPrice = {};
      prices.map((item) => {
        dataPrice[item.column] = item;
      });

      data.push({
        ...item.dataValues,
        ...servicesData.dataValues,
        ...dataPrice,
        prices,
      });
    }

    res.status(200).send({ services: data });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

const getAll = async (req, res) => {
  let data = {};

  try {
    const dataLangs = await Langs.findAll({
      attributes: ['id', 'name'],
      where: {
        active: 1,
      },
    });

    for (const lang of dataLangs) {
      const servicesData = await ServicesData.findAll({
        attributes: ['name', 'ServiceId', 'LangId'],
        order: [['name', 'ASC']],
        where: {
          LangId: lang.id,
        },
        include: Service,
      });

      data[lang.id] = [];

      for (const item of servicesData) {
        const prices = await ServicePrices.findAll({
          attributes: [
            'id',
            'title',
            'price',
            'from',
            'column',
            'ServiceId',
            'LangId',
            'createdAt',
            'updatedAt',
          ],
          where: {
            ServiceId: item.ServiceId,
            LangId: item.LangId,
          },
          order: [['column', 'ASC']],
        });

        const dataPrice = {};
        prices.map((item) => {
          dataPrice[item.column] = item;
        });

        data[lang.id].push({
          id: item.Service.id,
          active: item.Service.active,
          name: item.name,
          createdAt: item.Service.createdAt,
          updatedAt: item.Service.updatedAt,
          ...dataPrice,
          prices,
        });
      }
    }

    res.status(200).send({ services: data });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  let data = {};

  try {
    const service = await Service.findOne({
      attributes: ['id', 'ServiceCategoryId', 'active'],
      where: {
        id,
      },
    });

    if (!service) {
      res.status(404).send({ message: 'Service not found' });
      return;
    }

    const serviceData = await ServicesData.findAll({
      attributes: { exclude: ['ServiceId', 'createdAt', 'updatedAt'] },
      where: {
        ServiceId: service.id,
      },
    });

    for (const item of serviceData) {
      const price = await ServicePrices.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'ServiceId', 'LangId', 'column'],
        },
        where: {
          ServiceId: service.id,
          LangId: item.LangId,
        },
      });

      const works = await ServicesWorks.findAll({
        attributes: {
          exclude: [
            'id',
            'createdAt',
            'updatedAt',
            'ServiceId',
            'LangId',
            'ServiceDatumId',
          ],
        },
        where: {
          ServiceId: service.id,
          LangId: item.LangId,
        },
      });
      data[item.LangId] = {
        ...item.dataValues,
        price: [...price.map((item) => item.dataValues)],
        works: [...works.map((item) => item.WorkId)],
      };
    }

    res.status(200).send({
      service: {
        ...service.dataValues,
        ...data,
      },
    });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

const create = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { active, ServiceCategoryId, ...data } = req.body;

    const service = await Service.create(
      {
        ServiceCategoryId,
        active,
      },
      { transaction: t }
    );

    for (const item in data) {
      const { advantage = [], price = [], works = [] } = data[item];

      delete data[item]['price'];
      delete data[item]['advantage'];
      delete data[item]['works'];

      const serviceData = await ServicesData.create(
        { ServiceId: service.id, LangId: item, ...data[item] },
        { transaction: t }
      );

      if (price.length) {
        await ServicePrices.bulkCreate(
          price.map((itemPrice, index) => ({
            ServiceId: service.id,
            LangId: item,
            ServiceDatumId: serviceData.id,
            ...itemPrice,
            column: `column_${index + 1}`,
          })),
          { transaction: t }
        );
      }

      if (works.length) {
        await ServicesWorks.bulkCreate(
          works.map((itemWork) => ({
            ServiceId: service.id,
            LangId: item,
            WorkId: itemWork,
          })),
          { transaction: t }
        );
      }
    }

    await t.commit();

    res.status(200).send({ service: service.id });
  } catch (error) {
    await t.rollback();
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

const update = async (req, res) => {
  const { active, ServiceCategoryId, ...data } = req.body;
  const { id } = req.params;

  const t = await db.sequelize.transaction();

  try {
    const service = await Service.findOne({
      attributes: ['id', 'active'],
      where: {
        id,
      },
    });

    if (!service) {
      res.status(404).send({ message: 'Service not found' });
      return;
    }

    await Service.update(
      {
        active,
        ServiceCategoryId,
      },
      {
        where: {
          id: service.id,
        },
        transaction: t,
      }
    );

    for (const item in data) {
      const { advantage = [], price = [], works = [] } = data[item];

      delete data[item]['price'];
      delete data[item]['advantage'];
      delete data[item]['works'];

      await ServicesData.update(
        { ...data[item] },
        {
          where: {
            ServiceId: service.id,
            LangId: item,
          },
          transaction: t,
        }
      );

      await ServicePrices.destroy({
        where: {
          ServiceId: service.id,
          LangId: item,
        },
        transaction: t,
      });

      await ServicesWorks.destroy({
        where: {
          ServiceId: service.id,
          LangId: item,
        },
        transaction: t,
      });

      if (price.length) {
        await ServicePrices.bulkCreate(
          price.map((itemPrice, index) => ({
            ServiceId: service.id,
            LangId: item,
            ...itemPrice,
            column: `column_${index + 1}`,
          })),
          { transaction: t }
        );
      }

      if (works.length) {
        await ServicesWorks.bulkCreate(
          works.map((itemWork) => ({
            ServiceId: service.id,
            LangId: item,
            WorkId: itemWork,
          })),
          { transaction: t }
        );
      }
    }

    await t.commit();

    res.status(200).send({ service: service.id });
  } catch (error) {
    await t.rollback();
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findOne({
      attributes: ['id', 'active'],
      where: {
        id,
      },
    });

    if (!service) {
      res.status(404).send({ message: 'Service not found' });
      return;
    }

    await Service.destroy({
      where: {
        id,
      },
    });

    res.status(200).send({ service: service.id });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

const paths = async (req, res) => {
  try {
    const servicesData = await ServicesData.findAll({
      attributes: ['url'],
      include: [
        { model: Service, where: { active: 1 }, attributes: ['id'] },
        { model: Langs, where: { active: 1 }, attributes: ['code'] },
      ],
      raw: true,
    });

    res.status(200).send({ services: servicesData });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

const getByUrl = async (req, res) => {
  const { url, lang } = req.params;
  const data = [];
  try {
    const serviceData = await ServicesData.findOne({
      where: {
        url,
      },
      include: [
        {
          model: Service,
          where: { active: 1 },
          attributes: ['id', 'ServiceCategoryId'],
        },
        { model: Langs, where: { code: lang }, attributes: [] },
      ],
      raw: true,
    });

    const catData = await ServiceCategoriesData.findOne({
      attributes: ['name'],
      where: {
        ServiceCategoryId: serviceData['Service.ServiceCategoryId'],
      },
      include: [{ model: Langs, where: { code: lang }, attributes: [] }],
    });

    serviceData.category = catData.name;

    const prices = await ServicePrices.findAll({
      attributes: ['id', 'title', 'price', 'from', 'column', 'promo'],
      where: {
        ServiceId: serviceData.ServiceId,
        LangId: serviceData.LangId,
      },
      order: [['column', 'ASC']],
    });

    serviceData.prices = prices.map((item) => item.dataValues);

    const works = await ServicesWorks.findAll({
      attributes: ['WorkId'],
      where: {
        ServiceId: serviceData.ServiceId,
        LangId: serviceData.LangId,
      },
      include: [
        {
          model: Works,
          where: { active: 1 },
          attributes: ['id'],
        },
      ],
      raw: true,
    });

    serviceData.works = await WorksData.findAll({
      attributes: ['name', 'url', 'prev_img', 'img'],
      where: {
        WorkId: works.map((item) => item.WorkId),
        LangId: serviceData.LangId,
      },
      include: [
        {
          model: Works,
          attributes: ['id'],
          include: [
            {
              model: WorkTypes,
              attributes: ['name'],
            },
          ],
        },
      ],
      raw: true,
    });

    serviceData.alternateURLs = await ServicesData.findAll({
      attributes: ['url'],
      where: {
        ServiceId: serviceData.ServiceId,
      },
      include: [{ model: Langs, attributes: ['code'] }],
      raw: true,
    });

    res.status(200).send({ service: serviceData });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

export { create, getByLang, getAll, getById, update, deleteService, paths, getByUrl };
