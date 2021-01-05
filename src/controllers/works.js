import path from 'path';
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
        attributes: ['name', 'WorkId', 'LangId'],
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

export { create, upload, getAll, deleteWork, getById, update };
