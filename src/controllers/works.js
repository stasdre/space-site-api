import path from 'path';
import { Op } from 'sequelize';
import db from '../models';

const Work = db.work;
const Langs = db.lang;
const WorksData = db.worksData;
const WorkTypes = db.workTypes;

const create = async (req, res) => {
  const t = await db.sequelize.transaction();
  const { active, WorkTypeId, ...data } = req.body;
  try {
    const work = await Work.create({ active, WorkTypeId }, { transaction: t });

    for (const item in data) {
      await WorksData.create(
        { WorkId: work.id, LangId: item, ...data[item] },
        { transaction: t }
      );
    }

    await t.commit();

    res.status(200).send({ work: work.id });
  } catch (error) {
    await t.rollback();
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
      const worksData = await WorksData.findAll({
        attributes: ['name', 'WorkId', 'LangId', 'id'],
        where: {
          LangId: lang.id,
        },
        include: { model: Work, include: WorkTypes },
      });

      data[lang.id] = [];

      for (const item of worksData) {
        data[lang.id].push({
          id: item.Work.id,
          active: item.Work.active,
          name: item.name,
          WorkType: item.Work.WorkType.name,
          createdAt: item.Work.createdAt,
          updatedAt: item.Work.updatedAt,
          dataId: item.id,
        });
      }
    }

    res.status(200).send({ works: data });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  let data = {};

  try {
    const work = await Work.findOne({
      attributes: ['id', 'active', 'WorkTypeId'],
      where: {
        id,
      },
    });

    if (!work) {
      res.status(404).send({ message: 'Work not found' });
      return;
    }

    const workData = await WorksData.findAll({
      attributes: { exclude: ['WorkId', 'createdAt', 'updatedAt'] },
      where: {
        WorkId: work.id,
      },
    });

    for (const item of workData) {
      data[item.LangId] = {
        ...item.dataValues,
      };
    }

    res.status(200).send({
      work: {
        ...work.dataValues,
        ...data,
      },
    });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

const paths = async (req, res) => {
  try {
    const worksData = await WorksData.findAll({
      attributes: ['url'],
      include: [
        { model: Work, where: { active: 1 }, attributes: ['id'] },
        { model: Langs, where: { active: 1 }, attributes: ['code'] },
      ],
      raw: true,
    });

    res.status(200).send({ works: worksData });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

const upload = (req, res) => {
  res.sendFile(path.join(__dirname, '../../', req.file.path), {
    headers: {
      'content-type': req.file.mimetype,
    },
  });
};

const update = async (req, res) => {
  const { active, WorkTypeId, ...data } = req.body;
  const { id } = req.params;

  const t = await db.sequelize.transaction();

  try {
    const work = await Work.findOne({
      attributes: ['id', 'active', 'WorkTypeId'],
      where: {
        id,
      },
    });

    if (!work) {
      res.status(404).send({ message: 'Work not found' });
      return;
    }

    await Work.update(
      {
        active,
        WorkTypeId,
      },
      {
        where: {
          id: work.id,
        },
        transaction: t,
      }
    );

    for (const item in data) {
      await WorksData.update(
        { ...data[item] },
        {
          where: {
            WorkId: work.id,
            LangId: item,
          },
          transaction: t,
        }
      );
    }

    await t.commit();

    res.status(200).send({ work: work.id });
  } catch (error) {
    await t.rollback();
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

const deleteWork = async (req, res) => {
  const { id } = req.params;

  try {
    const work = await Work.findOne({
      attributes: ['id', 'active'],
      where: {
        id,
      },
    });

    if (!work) {
      res.status(404).send({ message: 'Work not found' });
      return;
    }

    await Work.destroy({
      where: {
        id,
      },
    });

    res.status(200).send({ work: work.id });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

const getByUrl = async (req, res) => {
  const { url, lang } = req.params;

  try {
    const workData = await WorksData.findOne({
      attributes: [
        'id',
        'WorkId',
        'LangId',
        'meta_title',
        'meta_desc',
        'h1',
        'name',
        'description',
        'url',
        'img',
        'order',
      ],
      where: {
        url,
      },
      include: [
        {
          model: Work,
          where: { active: 1 },
          attributes: ['id'],
        },
        { model: Langs, where: { code: lang }, attributes: [] },
      ],
      raw: true,
    });

    workData.alternateURLs = await WorksData.findAll({
      attributes: ['url'],
      where: {
        WorkId: workData.WorkId,
      },
      include: [{ model: Langs, attributes: ['code'] }],
      raw: true,
    });

    workData.nextWork = await WorksData.findOne({
      attributes: ['id', 'url', 'name'],
      where: { order: { [Op.gt]: workData.order }, LangId: workData.LangId },
      order: [
        ['order', 'ASC'],
        ['id', 'ASC'],
      ],
      raw: true,
    });

    if (!workData.nextWork) {
      workData.nextWork = await WorksData.findOne({
        attributes: ['id', 'url', 'name'],
        where: { LangId: workData.LangId },
        order: [
          ['order', 'ASC'],
          ['id', 'ASC'],
        ],
        raw: true,
      });
    }

    workData.prevWork = await WorksData.findOne({
      attributes: ['id', 'url', 'name'],
      where: { order: { [Op.lt]: workData.order }, LangId: workData.LangId },
      order: [
        ['order', 'DESC'],
        ['id', 'ASC'],
      ],
      raw: true,
    });

    if (!workData.prevWork) {
      workData.prevWork = await WorksData.findOne({
        attributes: ['id', 'url', 'name'],
        where: { LangId: workData.LangId },
        order: [
          ['order', 'DESC'],
          ['id', 'ASC'],
        ],
        raw: true,
      });
    }

    res.status(200).send({ work: workData });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

const getByLang = async (req, res) => {
  const { lang, page = 1 } = req.params;
  const limit = 8;
  try {
    const workData = await WorksData.findAll({
      attributes: ['name', 'url', 'prev_img', 'img'],
      include: [
        {
          model: Work,
          where: { active: 1 },
          attributes: ['id', 'WorkTypeId'],
          include: [{ model: WorkTypes, attributes: ['name'] }],
        },
        { model: Langs, where: { code: lang }, attributes: [] },
      ],
      offset: page <= 1 ? 0 : (page - 1) * limit,
      limit,
      order: [['order', 'DESC']],
      raw: true,
    });

    if (!workData.length) {
      res.status(404).send({ message: 'Works not found' });
      return;
    }

    res.status(200).send({ data: workData });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

export {
  create,
  upload,
  getAll,
  deleteWork,
  getById,
  update,
  paths,
  getByUrl,
  getByLang,
};
