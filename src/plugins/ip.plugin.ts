import { FastifyPluginAsync, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

interface ClientInfo {
	readonly ip: string;
	// readonly country: string | null;
}

declare module "fastify" {
	interface FastifyRequest {
		client: ClientInfo
	}
}

const plugin: FastifyPluginAsync = async (app) => {
	app.addHook("preHandler", async (
		req: FastifyRequest<{
			Headers: {
				"CF-IPCountry"?: string;
				"CF-Connecting-IP"?: string;
				"X-Real-Ip"?: string;
				"X-Forwarded-For"?: string;
			};
		}>,
	) => {
		req.client = {
			ip: req.headers["cf-connecting-ip"] ?? req.headers["x-real-ip"] ?? req.headers["x-forwarded-for"]?.split(",")?.[0] ?? req.ip,
			// country: req.headers["cf-ipcountry"] ?? null,
		};
	});
};

export default fp(plugin);