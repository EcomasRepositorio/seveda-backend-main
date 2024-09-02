import { Router } from "express";
import { showAllPosts, createPost, updatePost, deletePost } from "../controllers/posts.controllers";
import { validatePost } from "../middlewares/post.middlewares";
import { imageUpload } from "../middlewares/certificate.middlewares";
import { pagination } from "../utils/pagination.server";
import { adminRole, userRole } from "../middlewares/role.middlewares";
import { authenticate } from "../middlewares/auth.middlewares";

export const postRoute = Router();

postRoute.get("/posts", showAllPosts)
postRoute.post("/post", authenticate, userRole, imageUpload, createPost)
postRoute.put("/post/:id", authenticate, userRole, validatePost, updatePost)
postRoute.delete("/post/:id", authenticate, userRole, deletePost)