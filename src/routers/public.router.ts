import { FastifyPluginAsync } from "fastify";
import { serveJs, acceptData } from "../controllers/public.controller";

const router: FastifyPluginAsync = async (app) => {
	app.get("/:clientId", serveJs);
	app.post("/:clientId", acceptData);
};

export default router;