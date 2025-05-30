import { FastifyPluginAsync } from "fastify";
import fastifyCors from "@fastify/cors";

import { serveJs, acceptData } from "../controllers/public.controller";

const router: FastifyPluginAsync = async (app) => {
	await app.register(fastifyCors, {
		origin: "*",
		credentials: true
	});

	app.get("/:clientId", serveJs);
	app.post("/:clientId", acceptData);
};

export default router;