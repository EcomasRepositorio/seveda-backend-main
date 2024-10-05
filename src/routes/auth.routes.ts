import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controllers";
import { validateRegister } from "../middlewares/auth.middlewares";
import { adminRole } from "../middlewares/role.middlewares";
import { authenticate } from "../middlewares/auth.middlewares";

export const authRoute = Router();

authRoute.post("/user/register", registerUser);
authRoute.post("/user/login", loginUser);
