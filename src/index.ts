import express, { Request, Response } from "express";
import { doSomeHeavyTask } from "./util";
import client from "prom-client"; // Used for reading the metrics of the mechine
import responseTime from "response-time";
import { createLogger, transports } from "winston";
import LokiTransport from "winston-loki";
const options = {
  transports: [
    new LokiTransport({
      labels: {
        appName: "express",
      },
      host: "http://127.0.0.1:3100",
    }),
  ],
};
const logger = createLogger(options);

const app = express();
const PORT = process.env.PORT || 8000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const reqResTime = new client.Histogram({
  name: "http_express_req_res_time",
  help: "This tells how much time is taken by req and res",
  labelNames: ["method", "route", "status_code"],
  buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000],
});

const totalRequestCounter = new client.Counter({
  name: "total_request",
  help: "tels total request",
});

app.use(
  responseTime((req, res, time) => {
    totalRequestCounter.inc();
    reqResTime
      .labels({
        method: req.method,
        route: req.url,
        status_code: res.statusCode,
      })
      .observe(time);
  }),
);

app.get("/", (_req: Request, res: Response) => {
  logger.info("This is a request on / endpoint");
  return res.json({ message: `Hello from Express Server` });
});

app.get("/slow", async (_req: Request, res: Response) => {
  try {
    const timeTaken = await doSomeHeavyTask();
    return res.json({
      status: "Success",
      message: `Heavy task completed in ${timeTaken}ms`,
    });
  } catch (error) {
    logger.error(error.message);
    return res
      .status(500)
      .json({ status: "Error", error: "Internal Server Error" });
  }
});

// Following end-point exposes the metircs of the machine
app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
});

app.listen(PORT, () =>
  console.log(`Express Server Started at http://localhost:${PORT}`),
);
