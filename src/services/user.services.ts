import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma.server";
import { UserUpdate } from "../utils/format.server";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';

dotenv.config();

export class userServices {

  static async getUser(id: User["id"]) {
  try {
    const result = await prisma.user.findUnique({
      where: { id },
      select:{
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
      }
    })
    return result;
  } catch (error) {
    throw error;
  }
}
  // Mostrar todos los 'USER' & 'ADMIN'
  static async getAll(
    take: number,
    skip: number
  ) {
    try {
      const result = await prisma.user.findMany({
        orderBy: { id: "asc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
        },
        take,
        skip,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(data:UserUpdate, id: User["id"]) {
    try {
      const {
        email,
        firstName,
        lastName,
        phone,
        role,
      } = data;
      if (role === undefined) {
        throw new Error('La propiedad "role" en el objeto es undefined.');
      }
      const result = await prisma.user.update({
        where: { id },
        data: {
          email,
          firstName,
          lastName,
          phone,
          role,
        }
      });
      return result;
    }catch (error) {
      throw error;
    }
  }

  static async delete(id: User["id"]) {
    try {
      const result = await prisma.user.delete({
        where: { id },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}
export default userServices;
