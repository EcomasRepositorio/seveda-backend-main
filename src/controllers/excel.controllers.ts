/* import { Request, Response } from 'express';
import db from '../../models';
const Tutorial = db.tutorials;

import readXlsxFile from 'read-excel-file/node';

const upload = async (req: Request, res: Response) => {
  try {
    if (req.file === undefined) {
      return res.status(400).send('Please upload an excel file!');
    }

    let path =
      __dirname + '/resources/static/assets/uploads/' + req.file.filename;

    readXlsxFile(path).then((rows: any[]) => {
      // skip header
      rows.shift();

      let tutorials: any[] = [];

      rows.forEach((row) => {
        let tutorial = {
          id: row[0],
          title: row[1],
          description: row[2],
          published: row[3],
        };

        tutorials.push(tutorial);
      });

      Tutorial.bulkCreate(tutorials)
        .then(() => {
          res.status(200).send({
            message: 'Uploaded the file successfully: ' + req.file.originalname,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: 'Fail to import data into database!',
            error: error.message,
          });
        });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Could not upload the file: ' + req.file.originalname,
    });
  }
};

const getTutorials = (req: Request, res: Response) => {
  Tutorial.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving tutorials.',
      });
    });
};

export default {
  upload,
  getTutorials,
};

//https://www.bezkoder.com/node-js-upload-excel-file-database/
 */