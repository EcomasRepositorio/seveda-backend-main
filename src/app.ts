import app from "./routesmain";
import { prisma } from "./utils/prisma.server";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
// export const app = express();

const writerList = ["https://ecomas.pe", "https://www.ecomas.pe"]

app.use(cors({ 
  origin: ["localhost:8000"],
  methods: ['GET','POST','DELETE','PUT'],
  allowedHeaders: ['Contend-Type' , 'Authorization'],
 }));

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  prisma;
  res.status(200).json({
    message: "Wellcome to SEVEDA",
  });
});

export default app;