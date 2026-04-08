import cors from "cors";
import express from "express";
import helmet from "helmet";
import {
  CLIENT_ORIGINS,
  MONGO_URI,
  PORT,
} from "./config/appConfig.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import apiRouter from "./routes/apiRouter.js";
import { initializeApplicationState } from "./services/stateService.js";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || CLIENT_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
    credentials: false,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await initializeApplicationState();

    app.listen(PORT, () => {
      console.log(`NeedHelp backend listening on http://localhost:${PORT}`);
      console.log(`MongoDB connected at ${MONGO_URI}`);
      console.log(`Allowed client origins: ${CLIENT_ORIGINS.join(", ")}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
}

startServer();
