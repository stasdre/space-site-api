import db from '../models';

const Service = db.service;
const ServicesData = db.servicesData;
const ServicePrices = db.servicePrices;

const update = async (req, res) => {
  const { price } = req.body;
  const { id } = req.params;

  try {
    const priceData = await ServicePrices.findOne({
      attributes: ['id'],
      where: {
        id,
      },
    });

    if (!priceData) {
      res.status(404).send({ message: 'Service not found' });
      return;
    }

    await ServicePrices.update(
      {
        price,
      },
      {
        where: {
          id,
        },
      }
    );

    const newData = await ServicePrices.findOne({
      where: {
        id,
      },
    });

    res.status(200).send({ price: newData });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

const massUpdate = async (req, res) => {
  const { lang, services, price } = req.body;
  let finalData = {};

  const t = await db.sequelize.transaction();

  if (!price.length) {
    res.status(400).send({});
  }

  try {
    const servicesData = await ServicesData.findAll({
      where: {
        ServiceId: services,
        LangId: lang,
      },
      transaction: t,
    });

    await ServicePrices.destroy({
      where: {
        ServiceId: services,
        LangId: lang,
      },
      transaction: t,
    });

    for (const data of servicesData) {
      await ServicePrices.bulkCreate(
        price.map((itemPrice, index) => ({
          ServiceId: data.ServiceId,
          LangId: data.LangId,
          ServiceDatumId: data.id,
          ...itemPrice,
          column: `column_${index + 1}`,
        })),
        { transaction: t }
      );
    }

    const newPriceData = await ServicePrices.findAll({
      where: {
        ServiceId: services,
        LangId: lang,
      },
      order: [['column', 'ASC']],
      transaction: t,
    });

    newPriceData.forEach((item) => {
      if (!finalData[item.ServiceId]) {
        finalData[item.ServiceId] = {};
      }
      if (!finalData[item.ServiceId][item.column]) {
        finalData[item.ServiceId][item.column] = {};
      }

      if (!finalData[item.ServiceId]['prices']) {
        finalData[item.ServiceId]['prices'] = [];
      }
      finalData[item.ServiceId]['prices'].push(item);

      finalData[item.ServiceId][item.column] = { ...item.dataValues };
    });

    await t.commit();

    res.status(200).send({ lang, services, prices: finalData });
  } catch (error) {
    await t.rollback();
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

export { update, massUpdate };
