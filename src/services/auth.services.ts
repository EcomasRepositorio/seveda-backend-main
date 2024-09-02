import { User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { loginPick, userPick, UserRole } from "../utils/format.server";
import { prisma } from "../utils/prisma.server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();
const secret = process.env.ACCESS_TOKEN_SECRET;

export class authServices {

  // Registrar un 'USER' | 'ADMIN'
  static async register(data: UserRole) {
    console.log(data)
    const { email, password, firstName, lastName, phone, role } = data;

    // Validación de datos
    if (!email || !password || !firstName || !lastName) {
      throw new Error('Datos incompletos. Asegúrate de proporcionar email, password, firstName y lastName.');
    }

    // Evita hacer hash de contraseñas vacías o indefinidas
    if (!password) {
      throw new Error('La contraseña no puede estar vacía.');
    }

    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          email,
          password: passwordHash,
          firstName,
          lastName,
          phone,
          role,
        },
      });
      return newUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Error: Email ya existente.');
        }
      }

      throw error;
    }
  }


  // Realizar un LOGIN
  static async login(data: loginPick) {
    try {
      const { email, password } = data;
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
          firstName: true,
          lastName: true,
        },
      });
      if (!user) return false;
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (!verifyPassword) return null;
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Generar un TOKEN
  static getToken(data: userPick) {
    try {
      if (secret) {
        const token = jwt.sign(data, secret, { algorithm: "HS256" });
        //console.log('Token generado:', token);
        return token;
      }
    } catch (error) {
      throw error;
    }
  }
}
export default authServices;