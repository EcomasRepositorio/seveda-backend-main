import { Post, User } from "@prisma/client";
import { prisma } from "../utils/prisma.server";
import { updatePostPick } from "../utils/format.server";

export class postService {
  static async getAll ( take: number, skip: number ) {
    try {
      const result = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        take,
        skip,
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            }
          }
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  };

  static async create (data:Post, authorId: User["id"], file: Express.Multer.File | undefined) {
    const {
      title,
      description
     } = data;
    try {
        const result = await prisma.post.create({
          data: {
            title,
            description,
            image: file ? `uploads/post/${file.filename}` : null,
            author: { connect: { id: authorId } },
          }
        });
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  static async update(id: Post["id"],
  { title, description }: updatePostPick
  ) {
    try {
      const result = await prisma.post.update({
        where: { id },
        data: {
          title,
          description,
        },
        select: {
          id: true,
          title: true,
          description: true,
          authorId: true,
        }
      })
      return result;
    } catch (error) {
      throw error;
    }
  };

  static async delete(id: Post["id"]) {
    try {
      const result = await prisma.post.delete({
        where: { id }
      });
      return result;
    } catch (error) {
      throw error;
    }
  };
};