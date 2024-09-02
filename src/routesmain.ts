import express from "express";
import cors from "cors";
import morgan from "morgan";
import { handleError } from "./middlewares/error.middlewares";
import { postRoute } from "./routes/post.routes";
import { studentRoute } from "./routes/student.routes";
import { authRoute } from "./routes/auth.routes";
import { userRoute } from "./routes/user.routes";

export const app = express();

//Development
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

const prefix: string = "/api/v1";
//Routes
app.use(prefix, userRoute);
app.use(prefix, postRoute);
app.use(prefix, studentRoute);
app.use(prefix, authRoute);

//Middleware Error
app.use(handleError);

export default app;
