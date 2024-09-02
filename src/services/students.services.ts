import { Student } from "@prisma/client";
import { prisma } from "../utils/prisma.server";
import { updateStudentPick } from "../utils/format.server";
import { StudentData } from "../utils/format.server";

export class studentServices {
  static async getStudent(id: Student["id"]) {
    try {
      const result = await prisma.student.findUnique({
        where: { id },
        select: {
          documentNumber: true,
          name: true,
          code: true,
          activityAcademy: true,
          participation: true,
          institute: true,
          hour: true,
          date: true,
          imageCertificate: true,
        }
      });
      if (!result) return false;
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getAll( take: number, skip: number ) {
    try {
      const result = await prisma.student.findMany({
        take,
        skip,
        orderBy: { id: "desc" },
          select: {
            id: true,
            documentNumber: true,
            name: true,
            code: true,
            activityAcademy: true,
            participation: true,
            institute: true,
            hour: true,
            date: true,
            imageCertificate: true,
          }
      });
      return result;
    } catch ( error ) {
      throw error;
    }
  }

  static async searchCode(code: Student["code"]) {
    try {
      const result = await prisma.student.findFirst({
        where: { code },
        select: {
          id: true,
          documentNumber: true,
          name: true,
          code: true,
          activityAcademy: true,
          participation: true,
          institute: true,
          hour: true,
          date: true,
          imageCertificate: true,
        }
      });
      if (!result) return null;
      return result;
    } catch ( error ) {
      throw error;
    }
  }

  static async searchDNI(documentNumber: Student["documentNumber"]) {
    try {
      const result = await prisma.student.findMany({
        where: {
          documentNumber: { equals: documentNumber }
        },
        select: {
          id: true,
          documentNumber: true,
          name: true,
          code: true,
          activityAcademy: true,
          participation: true,
          institute: true,
          hour: true,
          date: true,
          imageCertificate: true,
        },
        take: 15,
      });
      if (result.length === 0) {
        return null;
      }
      return result;
    } catch ( error ) {
      throw error;
    }
  }

  static async searchName(name: Student["name"]) {
    try {
      console.log(name);
      const result = await prisma.student.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive'
          },
        },
        orderBy: { name:"asc" },
        select: {
          id: true,
          documentNumber: true,
          name: true,
          code: true,
          activityAcademy: true,
          participation: true,
          institute: true,
          hour: true,
          date: true,
          imageCertificate: true,
        },
        take: 15,
      });
      console.log(result);
      return result || [];
    } catch ( error ) {
      throw error;
    }
  };

  static async create( data: Student, file: Express.Multer.File | undefined ) {
    try {
      const {
        documentNumber,
        name,
        code,
        activityAcademy,
        participation,
        institute,
        hour,
        date,
      } = data;
      const result = await prisma.student.create({
        data: {
          documentNumber,
          name,
          code,
          activityAcademy,
          participation,
          institute,
          hour,
          date,
          imageCertificate: file? `uploads/certificate/${file.filename}` : null,
        }
      });
      return result;
    } catch ( error ) {
      throw error;
    }
  };

  static async createAll(students: StudentData[], file: Express.Multer.File | undefined) {
    try {
      let imageCertificate: string | null = null;
      if (file) {
        const fileExtension = file.originalname.split('.').pop();
        imageCertificate = `uploads/certificate/${file.filename}.${fileExtension}`;
      }
      const result = await prisma.student.createMany({
        data: students
        .filter(student => student.documentNumber !== undefined && student.documentNumber !== null)
        .map(student => ({
          ...student,
          documentNumber: student.documentNumber.toString(),
          name: student.name.toString(),
          code: student.code.toString(),
          activityAcademy: student.activityAcademy.toString(),
          participation: student.participation.toString(),
          institute: student.institute.toString(),
          hour: student.hour.toString(),
          date: student.date.toString(),
          imageCertificate: student.imageCertificate?.toString() ?? null,
        })),
        skipDuplicates: false,
      });

      return result;
    } catch (error) {
      throw error;
    }
  };

  static async update(data: Student, id: Student["id"], file: Express.Multer.File | undefined) {
    try {
      const {
        documentNumber,
        name,
        code,
        activityAcademy,
        participation,
        institute,
        hour,
        date
      } = data;
      if (file) {
        data.imageCertificate = `uploads/certificate/${file.filename}`
      }
      const result = await prisma.student.update({
        where: { id: id },
        data: {
          documentNumber,
          name,
          code,
          activityAcademy,
          participation,
          institute,
          hour,
          date,
          imageCertificate: file? `uploads/certificate/${file.filename}` : null,
        }
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id: Student["id"]) {
    try {
      const result = await prisma.student.delete({
        where: { id },
      })
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async deleteAll() {
    try {
      const result = await prisma.student.deleteMany();
      return result;
    } catch (error) {
      throw error;
    }
  }
}