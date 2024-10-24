import app from "./routesmain";
import { prisma } from "./utils/prisma.server";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
// export const app = express();

const writerList = ["https://seveda.edu.pe", "https://www.seveda.edu.pe"]

app.use(cors({ origin: writerList }));

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  prisma;
  res.status(200).json({
    message: "Wellcome to - SEVEDA API",
  });
});

export default app;