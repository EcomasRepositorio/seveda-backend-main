import { Request as ExpressRequest, Response, NextFunction } from 'express';
import path from 'path';
import multer from 'multer';
import xlsx from 'xlsx';
import * as fs from 'fs/promises';
import { StudentData } from '../utils/format.server';

interface RequestWithStudentsData extends ExpressRequest {
  studentsData?: StudentData[];
}

const createExcelDir = async () => {
  const dir = path.join(process.cwd(), 'uploads', 'excel');
  try {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Directory ${dir} created successfully`);
  } catch (error) {
    console.error(`Error creating directory ${dir}:`, error);
  }
};

createExcelDir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/excel');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }).single('excelFile');

const excelUpload = async (
  req: RequestWithStudentsData,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'Error al cargar el archivo Excel' });
    }
    if (!req.file || !req.file.originalname) {
      return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
    }
    const fileName = req.file.originalname;
    console.log(fileName);
    const filePath = path.join(process.cwd(), 'uploads', 'excel', fileName);
    console.log(filePath);
    try {
      console.log(filePath);
      const workbook = xlsx.readFile( filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const data: unknown[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];
      console.log(data)

      const studentsData = data
        .filter((row, index) => index > 0 && row.length > 0)
        .map(row => {
          const [
            documentNumber,
            name,
            code,
            activityAcademy,
            participation,
            institute,
            hour,
            date,
            imageFilePath
          ] = row;
          return {
            documentNumber: documentNumber as string,
            name: name as string,
            code: code as string,
            activityAcademy: activityAcademy as string,
            participation: participation as string,
            institute: institute as string,
            hour: hour as string,
            date: date as string,
            imageCertificate: imageFilePath as string,
          };
        });
        console.log(studentsData);
        req.studentsData = studentsData;
      next();
    } catch (error) {
      console.error('Error al procesar el archivo Excel:', error);
      return res.status(500).json({ error: 'Error interno al procesar el archivo Excel' });
    }
  });
};

export default excelUpload;
