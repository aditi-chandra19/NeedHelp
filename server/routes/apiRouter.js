import { Router } from "express";
import { legacyApiController } from "../controllers/legacyApiController.js";

const apiRouter = Router();

apiRouter.use(async (request, response) => {
  await legacyApiController(request, response);
});

export default apiRouter;
