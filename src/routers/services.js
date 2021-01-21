const path = require('path');
const fs = require('fs');
// Core
import express from 'express';
import multer from 'multer';
import { Service } from '../controllers';
import { validator, authorization } from '../middleware';
import { createService } from '../schemas';
// Instruments
//import { limiter, authenticate } from '../../utils';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, process.env.SERVICES_IMG_PATH, '/services/'));
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split('/');
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
  },
});
const upload = multer({ storage });

export const router = express.Router();

router.get('/', Service.getAll);
router.get('/paths', Service.paths);
router.get('/:id', Service.getById);
router.get('/:url/:lang', Service.getByUrl);
router.get('/lang/:lang', Service.getByLang);

router.post('/create', authorization, validator(createService), Service.create);
router.post('/upload', authorization, upload.single('file'), (req, res) => {
  console.log('OldFile', req.body.oldFile);
  const { oldFile } = req.body;

  if (oldFile) {
    if (fs.existsSync(path.join(__dirname, process.env.SERVICES_IMG_PATH, oldFile))) {
      fs.unlinkSync(path.join(__dirname, process.env.SERVICES_IMG_PATH, oldFile));
    }
  }
  res.status(200).send({
    status: 'done',
    name: req.file.filename,
    url: `/services/${req.file.filename}`,
  });
});

router.put('/:id', authorization, validator(createService), Service.update);

router.delete('/:id', authorization, Service.deleteService);

export { router as services };
