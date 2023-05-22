import express, { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./utils/swagger_options";
import cors from "cors";

import merchantsRoute from "./routes/merchants";
import transactionsRoute from "./routes/transactions";

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
const app: Express = express();

app.use(express.json());
app.use(cors<Request>());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello, this is Express + Typescript" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs, { explorer: true }));

app.use("/merchants", merchantsRoute);
app.use("/transactions", transactionsRoute);

export default app;
