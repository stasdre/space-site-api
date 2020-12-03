import db from '../models';

const Service = db.service;

const create = async (req, res) => {
  try {
    const { works, ...data } = req.body;
    const serviceData = await Service.create(data);
    serviceData.setWorks(works);
    res.status(200).send({ serviceData });
  } catch (error) {}
};

export { create };
