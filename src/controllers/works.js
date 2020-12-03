import path from 'path';
import db from '../models';

const Work = db.work;
const WorkTypes = db.workTypes;

const create = async (req, res) => {
  try {
    const workData = await Work.create(req.body);
    res.status(200).send({ workData });
  } catch (error) {}
};

const getAll = async (req, res) => {
  try {
    const works = await Work.findAll({
      attributes: ['id', 'name'],
      include: WorkTypes,
    });

    res.status(200).send({ data: works });
  } catch (error) {}
};

const upload = (req, res) => {
  res.sendFile(path.join(__dirname, '../../', req.file.path), {
    headers: {
      'content-type': req.file.mimetype,
    },
  });
};

export { create, upload, getAll };
